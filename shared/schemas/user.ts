import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
});

export type UserDto = Static<typeof UserSchema>;
