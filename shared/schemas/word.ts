import { type Static, Type } from '@sinclair/typebox';

export const WordSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  symbols: Type.String(),
  transcription: Type.String(),
  translation: Type.String(),
});

export const CreateWordSchema = Type.Omit(WordSchema, ['id']);

export type WordDto = Static<typeof WordSchema>;
export type CreateWordDto = Static<typeof CreateWordSchema>;
