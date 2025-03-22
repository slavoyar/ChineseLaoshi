import { tags } from 'typia';

import type { Email, Id } from '../common';

export type CreateUserDto = {
  username: string;
  email: Email;
  password: string & tags.Format<'password'>;
};

export type UserDto = {
  id: Id;
} & Omit<CreateUserDto, 'password'>;

export type UpdateUserDto = Partial<CreateUserDto>;
