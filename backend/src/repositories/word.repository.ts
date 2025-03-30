import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { CreateWordDto, WordDto } from '@shared/types';

class WordRepository {
  searchWord(query: string) {
    try {
      return prisma.word.findMany({
        where: {
          OR: [
            { translation: { contains: query } },
            { translation: { contains: query } },
            { symbols: { contains: query } },
          ],
        },
      });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  createWord(data: CreateWordDto, client: PrismaClient = prisma) {
    try {
      return client.word.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  updateWord(data: Partial<WordDto>) {
    try {
      return prisma.word.update({ where: { id: data.id }, data });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  deleteWord(id: string, client: PrismaClient = prisma) {
    try {
      return client.word.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  deleteWords(ids: string[]) {
    try {
      return prisma.word.deleteMany({ where: { id: { in: ids } } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  getWordsInOtherGroups(groupId: string, wordIds: string[]) {
    try {
      return prisma.card.groupBy({
        by: ['wordId'],
        where: {
          wordId: { in: wordIds },
          groupId: { not: groupId }, // Only count words in cards from other groups
        },
        _count: {
          wordId: true,
        },
      });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }
}

export const wordRepository = new WordRepository();
