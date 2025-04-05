import { PrismaPromise, User } from '@prisma/client';
import type { UserRepositoryType } from '@repositories/user.repository';

import { users } from './user.data';

export const userRepository: UserRepositoryType = {
  getById: jest.fn(
    (id) => Promise.resolve(users.find((u) => u.id === id) ?? users[0]) as PrismaPromise<User>
  ),
  getByEmail: jest.fn((email) => {
    let user = users.find((u) => u.email === email);
    user ??= users.find((u) => u.username === email);
    user ??= users[0];
    return Promise.resolve(user) as PrismaPromise<User>;
  }),
  create: jest.fn(),
  update: jest.fn(),
};
