import { CardDto, CreateCardDto } from '@dtos';
import { Card } from '@prisma/client';
import { cardRepository, groupRepository, wordRepository } from '@repositories';

class CardService {
  async getCardsByGroupId(groupId: string): Promise<CardDto[]> {
    const cards = await cardRepository.getCardsByGroupId(groupId);
    return cards.map((card) => ({ id: card.id, word: card.word, progress: card.writeRatio }));
  }

  async createCard(data: CreateCardDto): Promise<Card> {
    if (!data.id) {
      const word = await wordRepository.createWord(data);
      data.id = word.id;
    }
    const card = await cardRepository.createCard({ wordId: data.id, groupId: data.groupId });
    await groupRepository.incrementWordCount(data.groupId);
    return card;
  }

  updateCard(): Promise<void> {
    throw new Error('Not implemented');
  }

  async deleteCard(id: string): Promise<void> {
    const cardsCount = await cardRepository.getCardsCount(id);
    if (cardsCount === 1) {
      const card = await cardRepository.getCardById(id);
      await wordRepository.deleteWord(card!.wordId);
    }
    await cardRepository.deleteCard(id);
  }
}

export const cardService = new CardService();
