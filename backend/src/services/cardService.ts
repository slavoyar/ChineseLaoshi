import { CustomError } from '@configs/errors';
import { CardDto, CreateCardDto, GetWriteCardDto, UpdateCardDto, UpdateCardStatsDto } from '@dtos';
import { Card, Word } from '@prisma/client';
import { cardRepository, groupRepository, wordRepository } from '@repositories';

const STEP_DIFF = 0.02;
const MAX_STEP = 0.2;
const MIN_STEP = 0.05;

class CardService {
  async getCardsByGroupId(groupId: string): Promise<CardDto[]> {
    const cards = await cardRepository.getCardsByGroupId(groupId);
    return cards.map((card) => ({ id: card.id, word: card.word, progress: card.progress }));
  }

  async createCard(data: CreateCardDto): Promise<Card> {
    if (!data.id) {
      const dataWithoutId = { ...data, groupId: undefined, id: undefined };
      const word = await wordRepository.createWord(dataWithoutId);
      data.id = word.id;
    }
    const card = await cardRepository.createCard({ wordId: data.id, groupId: data.groupId });
    await groupRepository.incrementWordCount(data.groupId);
    return card;
  }

  async deleteCard(id: string): Promise<void> {
    const cardsCount = await cardRepository.getCardsCount(id);
    if (cardsCount === 1) {
      const card = await cardRepository.getCardById(id);
      await wordRepository.deleteWord(card!.wordId);
    }
    await cardRepository.deleteCard(id);
  }

  async updateCard({ cardId, ...wordData }: UpdateCardDto): Promise<CardDto> {
    if (!wordData.id) {
      throw new CustomError('entityUpdateError');
    }
    const cardCount = await cardRepository.getCardsCount(wordData.id);

    if (cardCount !== 1) {
      const dataWithoutId = { ...wordData, groupId: undefined, id: undefined } as Omit<Word, 'id'>;
      const word = await wordRepository.createWord(dataWithoutId);
      const card = await cardRepository.updateCard({ id: cardId, wordId: word.id });
      return { id: card.id, progress: card.progress, word };
    }

    const [card, word] = await Promise.all([
      cardRepository.getCardById(cardId),
      wordRepository.updateWord(wordData),
    ]);
    return { id: card!.id, progress: card!.progress, word };
  }

  async updateCardStats({ id, guessed }: UpdateCardStatsDto): Promise<void> {
    const { progress, showCount, streak, isWinStreak } = await cardRepository.getCardById(id);

    const updatedStep = Math.min(MIN_STEP + STEP_DIFF * streak, MAX_STEP);

    await cardRepository.updateCard({
      id,
      progress: guessed ? Math.min(progress + updatedStep, 1) : Math.max(progress - updatedStep, 0),
      showCount: showCount + 1,
      step: updatedStep,
      isWinStreak: guessed,
      streak: guessed === isWinStreak ? streak + 1 : 0,
    });
  }

  async getWriteCards(data: GetWriteCardDto, userId: string): Promise<CardDto[]> {
    const cards = await cardRepository.getWriteCards(Number(data.count), userId, data.groupId);
    return cards.map((card) => ({
      id: card.id,
      progress: card.progress,
      word: card.word,
    }));
  }
}

export const cardService = new CardService();
