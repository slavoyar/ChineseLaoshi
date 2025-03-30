import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { CreateUserDto, UpdateUserDto } from '@shared/types';

class UserRepository {
  async getById(id: string) {
    try {
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user) {
        throw new CustomError('entityNotFoundError');
      }
      return user;
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        throw new CustomError('entityNotFoundError');
      }
      return user;
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  create(data: CreateUserDto) {
    try {
      return prisma.user.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  update(data: UpdateUserDto, userId: string) {
    try {
      return prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }
}

export const userRepository = new UserRepository();
