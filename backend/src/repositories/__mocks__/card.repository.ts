import type { CardRepositoryType } from '@repositories/card.repository';
import { mockPrismaPromise } from '@utils';

import { cards } from './card.data';

export const cardRepository: CardRepositoryType = {
  createCard: jest.fn(),
  deleteCard: jest.fn(),
  deleteCardByGroupId: jest.fn(() => mockPrismaPromise({ count: 1 })),
  getCardById: jest.fn(),
  getCardsByGroupId: jest.fn(
    () => Promise.resolve(cards) as ReturnType<typeof cardRepository.getCardsByGroupId>
  ),
  getCardsCount: jest.fn(),
  getWriteCards: jest.fn(),
  updateCard: jest.fn(),
};
