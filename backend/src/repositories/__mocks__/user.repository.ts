import type { UserRepositoryType } from '@repositories/user.repository';

export const userRepository: UserRepositoryType = {
  getById: jest.fn(),
  getByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
