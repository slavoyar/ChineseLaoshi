import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { CreateUserDto, Email, Id, UpdateUserDto } from '@shared/types';

class UserRepository {
  async getById(id: Id) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }

  async getByEmail(email: Email) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }

  create(data: CreateUserDto) {
    try {
      return prisma.user.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  update(data: UpdateUserDto, userId: Id) {
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
