import type { CardRepositoryType } from '@repositories/card.repository';

export const cardRepository: CardRepositoryType = {
  createCard: jest.fn(),
  deleteCard: jest.fn(),
  deleteCardByGroupId: jest.fn(),
  getCardById: jest.fn(),
  getCardsByGroupId: jest.fn(),
  getCardsCount: jest.fn(),
  getWriteCards: jest.fn(),
  updateCard: jest.fn(),
};
