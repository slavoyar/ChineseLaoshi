import { Word } from '@prisma/client';

export type CardDto = {
  id: string;
  word: Word;
};

export type CreateCardDto = Omit<Word, 'id'>;

export type UpdateCardDto = Partial<Word>;
