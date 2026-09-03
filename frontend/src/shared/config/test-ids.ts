/** Stable selectors for Playwright e2e — decoupled from layout and copy. */
export const testIds = {
  studyModes: {
    heading: 'study-modes-heading',
    mode: (mode: string) => `study-mode-${mode}` as const,
  },
  quiz: {
    prompt: 'quiz-prompt',
    choices: 'quiz-choices',
    choice: 'quiz-choice',
  },
  session: {
    complete: 'session-complete',
    continue: 'session-continue',
    finish: 'session-finish',
  },
  group: {
    createTrigger: 'create-group-trigger',
    createDialog: 'create-group-dialog',
    nameInput: 'create-group-name',
    submit: 'create-group-submit',
    card: 'group-card',
    title: 'group-title',
    editName: 'group-edit-name',
    renameInput: 'group-rename-input',
    renameSave: 'group-rename-save',
  },
  word: {
    addTrigger: 'add-word-trigger',
    createDialog: 'create-word-dialog',
    symbolsInput: 'create-word-symbols',
    translationInput: 'create-word-translation',
    submit: 'create-word-submit',
    card: 'word-card',
    delete: 'word-delete',
    emptyState: 'words-empty-state',
  },
  common: {
    confirmDelete: 'confirm-delete',
  },
  about: {
    heading: 'about-heading',
    backLink: 'about-back-link',
    faq: 'about-faq',
  },
} as const;
