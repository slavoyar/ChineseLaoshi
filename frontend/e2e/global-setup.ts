import fs from 'node:fs';
import path from 'node:path';

import { chromium } from '@playwright/test';
import jwt from 'jsonwebtoken';

import { E2E_USER_ID } from './seed-e2e-user';

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

async function globalSetup() {
  const authDir = path.join(process.cwd(), 'e2e', '.auth');
  fs.mkdirSync(authDir, { recursive: true });

  let jwtSecret: string;
  try {
    jwtSecret = await readJwtSecret();
  } catch (error) {
    console.warn(String(error));
    fs.writeFileSync(path.join(authDir, 'user.json'), JSON.stringify({ cookies: [], origins: [] }));
    return;
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
