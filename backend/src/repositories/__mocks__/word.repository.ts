import type { WordRepositoryType } from '@repositories/word.repository';
import { mockPrismaPromise } from '@utils';

export const wordRepository: WordRepositoryType = {
  createWord: jest.fn(),
  deleteWord: jest.fn(),
  deleteWords: jest.fn(),
  updateWord: jest.fn(),
  searchWord: jest.fn(),
  getWordsInOtherGroups: jest.fn(() => mockPrismaPromise([])),
};
