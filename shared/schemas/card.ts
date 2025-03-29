import { Static, Type } from '@sinclair/typebox';

import { WordSchema } from './word';

export const CardSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  groupId: Type.String({ format: 'uuid' }),
  progress: Type.Number(),
  word: WordSchema,
  showCount: Type.Number(),
  step: Type.Number(),
  isWinStreak: Type.Boolean(),
  streak: Type.Number(),
});

export const CreateCardSchema = Type.Object({
  word: Type.Union([Type.Omit(WordSchema, ['id']), Type.Pick(WordSchema, ['id'])]),
  groupId: Type.String({ format: 'uuid' }),
});

export const UpdateCardWordSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  word: WordSchema,
});

export const UpdateCardSchema = Type.Omit(Type.Partial(CardSchema), ['groupId']);

export const UpdateCardStatsSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  guessed: Type.Boolean(),
});

export const GetWriteCardSchema = Type.Object({
  count: Type.String(),
  groupId: Type.String({ format: 'uuid' }),
});

export type CardDto = Static<typeof CardSchema>;
export type CreateCardDto = Static<typeof CreateCardSchema>;
export type UpdateCardWordDto = Static<typeof UpdateCardWordSchema>;
export type UpdateCard = Static<typeof UpdateCardSchema>;
export type UpdateCardStatsDto = Static<typeof UpdateCardStatsSchema>;
export type GetWriteCardDto = Static<typeof GetWriteCardSchema>;
