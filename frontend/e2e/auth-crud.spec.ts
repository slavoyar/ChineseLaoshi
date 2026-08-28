import { expect, test } from '@playwright/test';

test.describe('Authenticated CRUD', () => {
  test('creates group, adds word, renames group, deletes word', async ({ page }) => {
    test.skip(
      !(await page.context().cookies()).some((cookie) => cookie.name === 'cl_session' && cookie.value),
      'Authenticated storage state was not seeded'
    );

    const groupName = `E2E ${Date.now()}`;
    const renamedGroup = `${groupName} updated`;

    await page.goto('/');
    await page.getByRole('button', { name: 'Create group' }).click();
    await page.getByLabel('Group name').fill(groupName);
    await page.getByRole('dialog').getByRole('button', { name: 'Create' }).click();
    await expect(page.getByRole('button', { name: `Open group ${groupName}` })).toBeVisible({
      timeout: 10_000,
    });

    await page.getByRole('button', { name: `Open group ${groupName}` }).click();
    await page.getByRole('button', { name: 'Add word' }).click();
    await page.locator('#create-word-symbols').fill('你好');
    await page.locator('#create-word-translation').fill('hello');
    await page.locator('#create-word-transcription').fill('ni hao');
    await page.getByRole('dialog', { name: 'Create word' }).getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('你好')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Edit group name' }).click();
    const nameInput = page.getByRole('textbox', { name: 'Group name' });
    await nameInput.fill(renamedGroup);
    await page.getByRole('button', { name: 'Save group name' }).click();
    await expect(page.getByRole('heading', { name: renamedGroup })).toBeVisible();

    await page.getByRole('button', { name: 'Delete word 你好' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('No words yet')).toBeVisible({ timeout: 10_000 });
  });
});
