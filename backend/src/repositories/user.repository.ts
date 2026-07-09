import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';

class UserRepository {
  async getById(id: string) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await prisma.user.findFirst({ where: { OR: [{ email }, { username: email }] } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }
}

export const userRepository = new UserRepository();
export type UserRepositoryType = typeof userRepository;
