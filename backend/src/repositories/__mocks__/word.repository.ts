import type { WordRepositoryType } from '@repositories/word.repository';
import { getUuid, mockPrismaPromise } from '@utils';

import { words } from './word.data';

export const wordRepository: WordRepositoryType = {
  createWord: jest.fn((word) => mockPrismaPromise({ ...word, id: getUuid(words.length + 1) })),
  deleteWord: jest.fn(),
  deleteWords: jest.fn(),
  updateWord: jest.fn(),
  searchWord: jest.fn((query) =>
    mockPrismaPromise(
      words.filter(
        (w) => w.symbols.includes(query) || w.translation.includes(query) || w.transcription.includes(query)
      )
    )
  ),
  getWordsInOtherGroups: jest.fn(() => mockPrismaPromise([])),
};
