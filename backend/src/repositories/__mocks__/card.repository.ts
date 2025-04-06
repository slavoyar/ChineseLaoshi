import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { CardRepositoryType } from '@repositories/card.repository';
import { getUuid, mockPrismaPromise } from '@utils';

import { cards } from './card.data';

export const cardRepository: CardRepositoryType = {
  getCardById: jest.fn((id) => mockPrismaPromise(cards.find((c) => c.id === id))),
  getCardsByGroupId: jest.fn((id) => mockPrismaPromise(cards.filter((c) => c.groupId === id))),
  createCard: jest.fn(),
  getCardsCount: jest.fn(),
  getWriteCards: jest.fn(),
  updateCard: jest.fn(() => mockPrismaPromise(cards[0])),
  deleteCardByGroupId: jest.fn(() => mockPrismaPromise({ count: 1 })),
  deleteCard: jest.fn((id) => {
    // we expect to get a P2025 error when id is not found
    if (id === getUuid(404)) {
      throw new PrismaClientKnownRequestError('P2025', { code: 'P2025', clientVersion: '4.0.0' });
    }
    return mockPrismaPromise(id);
  }),
};
