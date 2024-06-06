import { Word } from '.prisma/client'

export interface CreateCardRequest extends Partial<Word> {
  groupId: string;
  wordId?: string;
}

export interface UpdateCardRequest extends Partial<Word> {}