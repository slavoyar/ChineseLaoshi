import pg from 'pg';

export const E2E_USER_ID = 'e2e00000-0000-0000-0000-000000000001';

const dbUrl =
  process.env.E2E_DB_URL ??
  process.env.DB_URL ??
  'postgres://postgres:postgres@localhost:5433/chineselaoshi?sslmode=disable';

/** Upsert the Playwright auth user after embedded Postgres is running. */
export async function seedE2eUser(): Promise<void> {
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
  } finally {
    await client.end().catch(() => undefined);
  }
}
