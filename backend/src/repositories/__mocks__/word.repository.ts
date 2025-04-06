import type { WordRepositoryType } from '@repositories/word.repository';
import { getUuid, mockPrismaPromise } from '@utils';

import { words } from './word.data';

export const wordRepository: WordRepositoryType = {
  createWord: jest.fn((word) => mockPrismaPromise({ ...word, id: getUuid(words.length + 1) })),
  deleteWord: jest.fn(),
  deleteWords: jest.fn(),
  updateWord: jest.fn(),
  searchWord: jest.fn(),
  getWordsInOtherGroups: jest.fn(() => mockPrismaPromise([])),
};
