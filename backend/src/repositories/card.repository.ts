import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { UpdateCard } from '@shared/types';

class CardRepository {
  async getCardById(id: string) {
    try {
      const card = await prisma.card.findFirst({ where: { id } });
      if (!card) {
        throw new CustomError('entityNotFoundError');
      }
      return card;
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  getCardsCount(wordId: string) {
    try {
      return prisma.card.count({ where: { wordId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  getCardsByGroupId(groupId: string) {
    try {
      return prisma.card.findMany({ where: { groupId }, include: { word: true } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  createCard(groupId: string, wordId: string, client: PrismaClient = prisma) {
    try {
      return client.card.create({ data: { groupId, wordId }, include: { word: true } });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  updateCard(data: UpdateCard, client: PrismaClient = prisma) {
    try {
      const wordId = data.word?.id;
      const dataWithoutWord = { ...data, word: undefined, wordId };
      return client.card.update({ where: { id: data.id }, data: dataWithoutWord });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  deleteCard(id: string, client: PrismaClient = prisma) {
    try {
      return client.card.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  deleteCardByGroupId(groupId: string) {
    try {
      return prisma.card.deleteMany({ where: { groupId } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  getWriteCards(count: number, userId: string, groupId?: string) {
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
