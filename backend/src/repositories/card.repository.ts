import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { UpdateCard } from '@shared/types';

class CardRepository {
  async getCardById(id: string) {
    const card = await prisma.card.findFirst({ where: { id } });
    if (!card) {
      throw new CustomError('entityNotFoundError');
    }
    return card;
  }

  getCardsCount(wordId: string) {
    return prisma.card.count({ where: { wordId } });
  }

  getCardsByGroupId(groupId: string) {
    return prisma.card.findMany({ where: { groupId }, include: { word: true } });
  }

  createCard(groupId: string, wordId: string, client: PrismaClient = prisma) {
    return client.card.create({ data: { groupId, wordId }, include: { word: true } });
  }

  updateCard(data: UpdateCard, client: PrismaClient = prisma) {
    const wordId = data.word?.id;
    const dataWithoutWord = { ...data, word: undefined, wordId };
    return client.card.update({ where: { id: data.id }, data: dataWithoutWord });
  }

  deleteCard(id: string, client: PrismaClient = prisma) {
    return client.card.delete({ where: { id } });
  }

  deleteCardByGroupId(groupId: string) {
    return prisma.card.deleteMany({ where: { groupId } });
  }

  getWriteCards(count: number, userId: string, groupId?: string) {
    return prisma.card.findMany({
      include: { word: true, group: true },
      where: { group: { userId, id: groupId } },
      orderBy: {
        progress: 'asc',
      },
      take: count,
    });
  }
}

export const cardRepository = new CardRepository();
export type CardRepositoryType = typeof cardRepository;
