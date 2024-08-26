import { CardDto, CreateCardDto, UpdateCardDto } from '../dtos';

class CardService {
  getCardsByGroupId(groupId: string): Promise<CardDto> {
    throw new Error('Not implemented');
  }

  createCard(data: CreateCardDto): Promise<void> {
    throw new Error('Not implemented');
  }

  updateCard(data: UpdateCardDto): Promise<void> {
    throw new Error('Not implemented');
  }

  deleteCard(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const cardService = new CardService();
