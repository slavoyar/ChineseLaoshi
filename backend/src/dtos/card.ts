import { Card, Word } from '@prisma/client';

export type CardDto = {
  id: string;
  progress: number;
  word: Word;
};

export type CreateCardDto = Word & { groupId: string };

export type UpdateCardDto = Partial<Word>;

export type CreateCard = Pick<Card, 'wordId' | 'groupId'>;

export type UpdateCard = Pick<Card, 'wordId' | 'id'>;
