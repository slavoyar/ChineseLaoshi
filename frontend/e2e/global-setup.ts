import fs from 'node:fs';
import path from 'node:path';

import { chromium, type FullConfig } from '@playwright/test';
import jwt from 'jsonwebtoken';
import pg from 'pg';

export const E2E_USER_ID = 'e2e00000-0000-0000-0000-000000000001';
const SESSION_COOKIE = 'cl_session';

async function readJwtSecret(): Promise<string> {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  const envPath = path.resolve(process.cwd(), '../backend/.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^JWT_SECRET=(.+)$/m);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  throw new Error('JWT_SECRET is required for authenticated e2e tests');
}

async function globalSetup(config: FullConfig) {
  const authDir = path.join(config.rootDir, 'e2e', '.auth');
  fs.mkdirSync(authDir, { recursive: true });

  let jwtSecret: string;
  try {
    jwtSecret = await readJwtSecret();
  } catch (error) {
    console.warn(String(error));
    fs.writeFileSync(path.join(authDir, 'user.json'), JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const dbUrl =
    process.env.E2E_DB_URL ??
    process.env.DB_URL ??
    'postgres://postgres:postgres@localhost:5433/chineselaoshi?sslmode=disable';

  const client = new pg.Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.query(
      `
      INSERT INTO "User" (id, username, email, password, provider, provider_subject, avatar_url, "onboardingCompleted")
      VALUES ($1, 'e2e-user', 'e2e@chineselaoshi.local', NULL, 'google', 'e2e-playwright', '', true)
      ON CONFLICT (id) DO UPDATE SET "onboardingCompleted" = true
    `,
      [E2E_USER_ID]
    );
  } catch (error) {
    console.warn('E2E user seed skipped:', error);
  } finally {
    await client.end().catch(() => undefined);
  }

  const token = jwt.sign(
    {
      uid: E2E_USER_ID,
      username: 'e2e-user',
      email: 'e2e@chineselaoshi.local',
    },
    jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
      subject: E2E_USER_ID,
    }
  );

  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  await context.storageState({ path: path.join(authDir, 'user.json') });
  await browser.close();
}

export default globalSetup;
