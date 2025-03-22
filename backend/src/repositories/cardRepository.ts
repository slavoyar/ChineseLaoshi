import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { Id, UpdateCard } from '@shared/types';

class CardRepository {
  async getCardById(id: Id) {
    try {
      const card = await prisma.card.findFirst({ where: { id } });
      if (!card) {
        throw new Error('no card');
      }
      return card;
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  getCardsCount(wordId: Id) {
    try {
      return prisma.card.count({ where: { wordId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  getCardsByGroupId(groupId: Id) {
    try {
      return prisma.card.findMany({ where: { groupId }, include: { word: true } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  createCard(groupId: Id, wordId: Id) {
    try {
      return prisma.card.create({ data: { groupId, wordId }, include: { word: true } });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  updateCard(data: UpdateCard) {
    try {
      const wordId = data.word?.id;
      const dataWithoutWord = { ...data, word: undefined, wordId };
      return prisma.card.update({ where: { id: data.id }, data: dataWithoutWord });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  async deleteCard(id: Id) {
    try {
      await prisma.card.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  async deleteCardByGroupId(groupId: Id) {
    try {
      await prisma.card.deleteMany({ where: { groupId } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  getWriteCards(count: number, userId: Id, groupId?: Id) {
    try {
      return prisma.card.findMany({
        include: { word: true, group: true },
        where: { group: { userId, id: groupId } },
        orderBy: {
          progress: 'asc',
        },
        take: count,
      });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }
}

export const cardRepository = new CardRepository();
