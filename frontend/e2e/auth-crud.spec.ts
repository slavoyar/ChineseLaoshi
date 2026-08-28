import { expect, test } from '@playwright/test';

import { e2e } from './locators';
import { seedE2eUser } from './seed-e2e-user';

test.describe('Authenticated CRUD', () => {
  test.beforeAll(async () => {
    await seedE2eUser();
  });

  test('creates group, adds word, renames group, deletes word', async ({ page }) => {
    test.setTimeout(60_000);
    test.skip(
      !(await page.context().cookies()).some((cookie) => cookie.name === 'cl_session' && cookie.value),
      'Authenticated storage state was not seeded'
    );

    const groupName = `E2E ${Date.now()}`;
    const renamedGroup = `${groupName} updated`;

    await page.goto('/');
    await e2e.createGroupTrigger(page).click();
    await e2e.createGroupNameInput(page).fill(groupName);
    await e2e.createGroupSubmit(page).click();
    await expect(e2e.groupCard(page, groupName)).toBeVisible({ timeout: 10_000 });

    await e2e.groupCard(page, groupName).click();
    await e2e.addWordTrigger(page).click();
    await e2e.createWordSymbols(page).fill('你好');
    await e2e.createWordTranslation(page).fill('hello');
    await expect(e2e.createWordSubmit(page)).toBeEnabled({ timeout: 15_000 });
    await e2e.createWordSubmit(page).click();

    await expect(e2e.wordCard(page, '你好')).toBeVisible({ timeout: 10_000 });

    await e2e.groupEditName(page).click();
    await e2e.groupRenameInput(page).fill(renamedGroup);
    await e2e.groupRenameSave(page).click();
    await expect(e2e.groupTitle(page)).toHaveText(renamedGroup);

    await e2e.wordDelete(page, '你好').click();
    await e2e.confirmDelete(page).click();
    await expect(e2e.wordsEmptyState(page)).toBeVisible({ timeout: 10_000 });
  });
});
