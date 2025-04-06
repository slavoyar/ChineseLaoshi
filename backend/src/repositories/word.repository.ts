import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { CreateWordDto, WordDto } from '@shared/types';

class WordRepository {
  searchWord(query: string) {
    return prisma.word.findMany({
      where: {
        OR: [
          { translation: { contains: query } },
          { transcription: { contains: query } },
          { symbols: { contains: query } },
        ],
      },
      take: 10,
    });
  }

  createWord(data: CreateWordDto, client: PrismaClient = prisma) {
    return client.word.create({ data });
  }

  updateWord(data: Partial<WordDto>) {
    return prisma.word.update({ where: { id: data.id }, data });
  }

  deleteWord(id: string, client: PrismaClient = prisma) {
    return client.word.delete({ where: { id } });
  }

  deleteWords(ids: string[]) {
    return prisma.word.deleteMany({ where: { id: { in: ids } } });
  }

  getWordsInOtherGroups(groupId: string, wordIds: string[]) {
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
  }
}

export const wordRepository = new WordRepository();
export type WordRepositoryType = typeof wordRepository;
