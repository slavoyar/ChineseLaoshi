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

  async create(data: CreateUserDto) {
    try {
      await prisma.user.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  async update(data: UpdateUserDto) {
    try {
      await prisma.user.update({
        where: { id: data.id },
        data: { password: data.password, username: data.username },
      });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }
}

export const userRepository = new UserRepository();
