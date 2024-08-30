import { Card, Word } from '@prisma/client';

export type CardDto = {
  id: string;
  progress: number;
  word: Word;
};

export type CreateCardDto = Word & { groupId: string };

export type UpdateCardDto = Partial<Word> & { cardId: string };

export type CreateCard = Pick<Card, 'wordId' | 'groupId'>;

export type UpdateCard = Partial<Card>;

export type UpdateCardStatsDto = {
  id: string;
  guessed: boolean;
};

export type GetWriteCardDto = {
  count: string;
};
