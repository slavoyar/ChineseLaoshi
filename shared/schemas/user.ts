import { type Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
});

export const CreateUserSchema = Type.Object({
  username: Type.String({ minLength: 3 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ format: 'password', minLength: 8 }),
});

export const UpdateUserSchema = Type.Partial(CreateUserSchema);

export const UpdatePasswordSchema = Type.Object({
  password: Type.String(),
  token: Type.String(),
});

export const LoginSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export const ResetPasswordSchema = Type.Object({
  email: Type.String({ format: 'email' }),
});

export type UserDto = Static<typeof UserSchema>;
export type CreateUserDto = Static<typeof CreateUserSchema>;
export type UpdateUserDto = Static<typeof UpdateUserSchema>;
export type ResetPasswordDto = Static<typeof ResetPasswordSchema>;
