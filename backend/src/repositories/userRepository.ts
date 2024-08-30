import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { CreateUserDto, UpdateUserDto } from '@dtos';
import { User } from '@prisma/client';

class UserRepository {
  async getById(id: string): Promise<User> {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }

  async create(data: CreateUserDto) {
    try {
      return await prisma.user.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  update(data: UpdateUserDto) {
    try {
      const withoutId = { ...data, id: undefined };
      return prisma.user.update({
        where: { id: data.id },
        data: withoutId,
      });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }
}

export const userRepository = new UserRepository();
