import { type Static, Type } from '@sinclair/typebox';

export const GroupSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  name: Type.String({ minLength: 1 }),
  wordCount: Type.Number(),
});

export const CreateGroupSchema = Type.Pick(GroupSchema, ['name']);

export const UpdateGroupSchema = Type.Pick(GroupSchema, ['id', 'name']);

export type GroupDto = Static<typeof GroupSchema>;
export type CreateGroupDto = Static<typeof CreateGroupSchema>;
export type UpdateGroupDto = Static<typeof UpdateGroupSchema>;
