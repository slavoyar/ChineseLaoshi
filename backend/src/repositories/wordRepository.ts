import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { Word } from '@prisma/client';

class WordRepository {
  async searchWord(query: string) {
    try {
      return await prisma.word.findMany({
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

  async createWord(data: Omit<Word, 'id'>) {
    try {
      return await prisma.word.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  async updateWord(data: Partial<Word>) {
    try {
      await prisma.word.update({ where: { id: data.id }, data });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  async deleteWord(id: string) {
    try {
      await prisma.word.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }
}

export const wordRepository = new WordRepository();
