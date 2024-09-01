import { User } from '@prisma/client';

export type UserDto = Omit<User, 'password'>;

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<User>;
