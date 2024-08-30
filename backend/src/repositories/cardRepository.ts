import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { CreateCard, UpdateCard } from '@dtos';

class CardRepository {
  async getCardById(id: string) {
    try {
      return await prisma.card.findFirst({ where: { id } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  async getCardsCount(wordId: string) {
    try {
      return await prisma.card.count({ where: { wordId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  async getCardsByGroupId(groupId: string) {
    try {
      return await prisma.card.findMany({ where: { groupId }, include: { word: true } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  async createCard(data: CreateCard) {
    try {
      return await prisma.card.create({ data, include: { word: true } });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  async updateCard(data: UpdateCard) {
    try {
      const dataWithoutId = { ...data, id: undefined };
      return await prisma.card.update({ where: { id: data.id }, data: dataWithoutId });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  async deleteCard(id: string) {
    try {
      await prisma.card.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  async deleteCardByGroupId(groupId: string) {
    try {
      await prisma.card.deleteMany({ where: { groupId } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  getWriteCards(count: number, userId: string) {
    try {
      return prisma.card.findMany({
        include: { word: true, group: true },
        where: { group: { userId } },
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
