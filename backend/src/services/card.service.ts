import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { cardRepository, groupRepository, wordRepository } from '@repositories';
import type {
  CardDto,
  CreateCardDto,
  GetWriteCardDto,
  Id,
  UpdateCardStatsDto,
  UpdateCardWordDto,
} from '@shared/types';
import typia from 'typia';

const STEP_DIFF = 0.02;
const MAX_STEP = 0.2;
const MIN_STEP = 0.05;

class CardService {
  async getCardsByGroupId(groupId: Id): Promise<CardDto[]> {
    const cards = await cardRepository.getCardsByGroupId(groupId);
    return cards;
  }

  async createCard(data: CreateCardDto): Promise<CardDto> {
    return prisma.$transaction(async (tx) => {
      let wordId;
      if (!typia.is<{ id: Id }>(data.word)) {
        const word = await wordRepository.createWord(data.word, tx);
        wordId = word.id;
      } else {
        wordId = data.word.id;
      }
      const card = await cardRepository.createCard(data.groupId, wordId, tx);
      await groupRepository.incrementWordCount(data.groupId, tx);
      return card;
    });
  }

  async deleteCard(id: Id): Promise<void> {
    const cardsCount = await cardRepository.getCardsCount(id);
    if (cardsCount === 1) {
      const card = await cardRepository.getCardById(id);
      await wordRepository.deleteWord(card!.wordId);
    }
    await cardRepository.deleteCard(id);
  }

  async updateCard(data: UpdateCardWordDto): Promise<CardDto> {
    if (!data.word.id) {
      throw new CustomError('entityUpdateError');
    }
    const cardCount = await cardRepository.getCardsCount(data.word.id);

    if (cardCount !== 1) {
      return prisma.$transaction(async (tx) => {
        const word = await wordRepository.createWord(data.word, tx);
        const card = await cardRepository.updateCard({ id: data.id, word }, tx);
        return { ...card, word };
      });
    }

    const [card, word] = await Promise.all([
      cardRepository.getCardById(data.id),
      wordRepository.updateWord(data.word),
    ]);

    return { ...card, word };
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

  getWriteCards(data: GetWriteCardDto, userId: Id): Promise<CardDto[]> {
    return cardRepository.getWriteCards(Number(data.count), userId, data.groupId);
  }
}

export const cardService = new CardService();
