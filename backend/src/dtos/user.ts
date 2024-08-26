import { User } from '@prisma/client';

export type UserDto = Pick<User, 'username'>;

export type CreateUserDto = Pick<User, 'username' | 'password'>;
export type UpdateUserDto = Partial<User>;
