import type { Id } from '../common';
import type { WithRequired } from '../utilities';
import type { WordDto } from './word';

export type CardDto = {
  id: Id;
  groupId: Id;
  progress: number;
  word: WordDto;
  showCount: number;
  step: number;
  isWinStreak: boolean;
  streak: number;
};

export type CreateCardDto = {
  word: { id: Id } | Omit<WordDto, 'id'>;
  groupId: Id;
};

export type UpdateCardWordDto = { id: Id; word: WordDto };

export type UpdateCard = Omit<WithRequired<Partial<CardDto>, 'id'>, 'groupId'>;

export type UpdateCardStatsDto = {
  id: Id;
  guessed: boolean;
};

export type GetWriteCardDto = {
  count: string;
  groupId: Id;
};
