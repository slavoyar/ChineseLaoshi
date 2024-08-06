import { Word } from '@prisma/client';

export interface CreateCardRequest extends Partial<Word> {
  wordId?: string;
}

export interface UpdateCardRequest extends Partial<Word> {}

export interface UpdateCardStats {
  guessed: boolean;
}
