import { expect, test } from '@playwright/test';

import { e2e, testIds } from './locators';

test.describe('Demo study flow', () => {
  test('home loads study modes', async ({ page }) => {
    await page.goto('/');
    await expect(e2e.studyModesHeading(page)).toBeVisible();
    await expect(e2e.studyMode(page, 'translation')).toBeVisible();
  });

  test('starts translation quiz session', async ({ page }) => {
    await page.goto('/');
    await e2e.studyMode(page, 'translation').click();
    await expect(page).toHaveURL(/\/write-practice\/5/);
    await expect(e2e.quizPrompt(page)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId(testIds.quiz.choice)).toHaveCount(4);
  });

  test('shows continue screen after five cards', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/');
    await e2e.studyMode(page, 'translation').click();
    await expect(e2e.quizPrompt(page)).toBeVisible({ timeout: 15_000 });

    for (let i = 0; i < 5; i += 1) {
      await e2e.quizChoice(page, 0).click();
      await page.waitForTimeout(800);
    }

    await expect(e2e.sessionComplete(page)).toBeVisible();
    await expect(e2e.sessionContinue(page)).toBeVisible();
    await expect(e2e.sessionFinish(page)).toBeVisible();
  });

  test('about page serves static content', async ({ page }) => {
    await page.goto('/about.html');
    await expect(e2e.aboutHeading(page)).toBeVisible();
    await expect(e2e.aboutBackLink(page)).toBeVisible();
  });
});
