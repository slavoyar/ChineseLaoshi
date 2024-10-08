import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { CreateCard, UpdateCard } from '@dtos';
import { Card } from '@prisma/client';

class CardRepository {
  async getCardById(id: string): Promise<Card> {
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

  createCard(data: CreateCard) {
    try {
      return prisma.card.create({ data, include: { word: true } });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  updateCard(data: UpdateCard) {
    try {
      const dataWithoutId = { ...data, id: undefined };
      return prisma.card.update({ where: { id: data.id }, data: dataWithoutId });
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
