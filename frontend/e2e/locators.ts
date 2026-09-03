import type { Page } from '@playwright/test';

import { testIds } from '../src/shared/config/test-ids';

export { testIds };

export const e2e = {
  studyModesHeading: (page: Page) => page.getByTestId(testIds.studyModes.heading),
  studyMode: (page: Page, mode: string) => page.getByTestId(testIds.studyModes.mode(mode)),
  quizPrompt: (page: Page) => page.getByTestId(testIds.quiz.prompt),
  quizChoice: (page: Page, index = 0) => page.getByTestId(testIds.quiz.choice).nth(index),
  sessionComplete: (page: Page) => page.getByTestId(testIds.session.complete),
  sessionContinue: (page: Page) => page.getByTestId(testIds.session.continue),
  sessionFinish: (page: Page) => page.getByTestId(testIds.session.finish),
  createGroupTrigger: (page: Page) => page.getByTestId(testIds.group.createTrigger),
  createGroupDialog: (page: Page) => page.getByTestId(testIds.group.createDialog),
  createGroupNameInput: (page: Page) => page.getByTestId(testIds.group.nameInput),
  createGroupSubmit: (page: Page) => page.getByTestId(testIds.group.submit),
  groupCard: (page: Page, name: string) =>
    page.locator(`[data-testid="${testIds.group.card}"][data-group-name="${name}"]`),
  addWordTrigger: (page: Page) => page.getByTestId(testIds.word.addTrigger),
  createWordDialog: (page: Page) => page.getByTestId(testIds.word.createDialog),
  createWordSymbols: (page: Page) => page.getByTestId(testIds.word.symbolsInput),
  createWordTranslation: (page: Page) => page.getByTestId(testIds.word.translationInput),
  createWordSubmit: (page: Page) => page.getByTestId(testIds.word.submit),
  wordCard: (page: Page, symbols: string) =>
    page.locator(`[data-testid="${testIds.word.card}"][data-word-symbols="${symbols}"]`),
  wordDelete: (page: Page, symbols: string) => e2e.wordCard(page, symbols).getByTestId(testIds.word.delete),
  groupEditName: (page: Page) => page.getByTestId(testIds.group.editName),
  groupRenameInput: (page: Page) => page.getByTestId(testIds.group.renameInput),
  groupRenameSave: (page: Page) => page.getByTestId(testIds.group.renameSave),
  groupTitle: (page: Page) => page.getByTestId(testIds.group.title),
  wordsEmptyState: (page: Page) => page.getByTestId(testIds.word.emptyState),
  confirmDelete: (page: Page) => page.getByTestId(testIds.common.confirmDelete),
  aboutHeading: (page: Page) => page.getByTestId(testIds.about.heading),
  aboutBackLink: (page: Page) => page.getByTestId(testIds.about.backLink),
  aboutFaq: (page: Page) => page.getByTestId(testIds.about.faq),
};
