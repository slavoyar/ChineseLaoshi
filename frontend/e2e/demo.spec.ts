import { expect, test } from '@playwright/test';

test.describe('Demo study flow', () => {
  test('home loads study modes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Study modes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Translation' })).toBeVisible();
  });

  test('starts translation quiz session', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Translation' }).click();
    await expect(page).toHaveURL(/\/write-practice\/5/);
    await expect(page.getByText(/Pick the translation/i)).toBeVisible({ timeout: 15_000 });
  });

  test('shows continue screen after five cards', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    await page.getByRole('button', { name: 'Translation' }).click();
    await expect(page.getByText(/Pick the translation/i)).toBeVisible({ timeout: 15_000 });

    for (let i = 0; i < 5; i += 1) {
      await page.locator('div.grid.gap-2 button').first().click();
      await page.waitForTimeout(800);
    }

    await expect(page.getByRole('heading', { name: /Session complete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  });

  test('about page serves static content', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.getByRole('heading', { name: 'Chinese Laoshi' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to app' })).toBeVisible();
  });
});
