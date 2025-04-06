import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { CreateUserDto, UpdateUserDto } from '@shared/types';

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

  create(data: CreateUserDto) {
    return prisma.user.create({ data });
  }

  update(data: UpdateUserDto, userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}

export const userRepository = new UserRepository();
export type UserRepositoryType = typeof userRepository;
