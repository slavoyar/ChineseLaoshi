import type { UserRepositoryType } from '@repositories/user.repository';
import { mockPrismaPromise } from '@utils';

import { users } from './user.data';

export const userRepository: UserRepositoryType = {
  getById: jest.fn((id) => mockPrismaPromise(users.find((u) => u.id === id))),
  getByEmail: jest.fn((email) => {
    let user = users.find((u) => u.email === email);
    user ??= users.find((u) => u.username === email);
    return mockPrismaPromise(user);
  }),
};
