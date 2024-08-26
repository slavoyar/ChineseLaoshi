import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { CreateCard, UpdateCard } from '@dtos';

class CardRepository {
  async getCardsByGroupId(groupId: string) {
    try {
      await prisma.card.findMany({ where: { groupId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  async createCard(data: CreateCard) {
    try {
      await prisma.card.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  async updateCard(data: UpdateCard) {
    try {
      const dataWithoutId = { ...data, id: undefined };
      await prisma.card.update({ where: { id: data.id }, data: dataWithoutId });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }
}

export const cardRepository = new CardRepository();
