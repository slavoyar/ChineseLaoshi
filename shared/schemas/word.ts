import type { Id } from '../common';

export type WordDto = {
  id: Id;
  symbols: string;
  transcription: string;
  translation: string;
};

export type CreateWordDto = Omit<WordDto, 'id'>;
