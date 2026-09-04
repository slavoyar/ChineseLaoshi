import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:5173/app',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'demo',
      testMatch: /demo\.spec\.ts/,
    },
    {
      name: 'auth',
      testMatch: /auth-crud\.spec\.ts/,
      use: {
        storageState: 'e2e/.auth/user.json',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:backend',
      url: 'http://localhost:3000/api/groups',
      cwd: '..',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: 'npm run dev --workspace=@chinese-laoshi/frontend',
      url: 'http://localhost:5173/app/',
      cwd: '..',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:web',
      url: 'http://localhost:3001',
      cwd: '..',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
