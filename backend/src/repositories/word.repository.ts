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

  deleteWord(id: string) {
    try {
      return prisma.word.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }
}

export const wordRepository = new WordRepository();
