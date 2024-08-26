import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import { CreateGroupDto, UpdateGroupDto } from '@dtos';

class GroupRepository {
  async getGroupsByUserId(userId: string) {
    try {
      return await prisma.group.findMany({ where: { userId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  createGroup(data: CreateGroupDto) {
    try {
      return prisma.group.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  updateGroup(data: UpdateGroupDto) {
    try {
      return prisma.group.update({ where: { id: data.id }, data });
    } catch {
      throw new CustomError('entityUpdateError');
    }
  }

  async deleteGroup(id: string) {
    try {
      await prisma.group.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  async incrementWordCount(id: string) {
    try {
      await prisma.group.update({ where: { id }, data: { wordCount: { increment: 1 } } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  async decrementWordCount(id: string) {
    try {
      await prisma.group.update({ where: { id }, data: { wordCount: { decrement: 1 } } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }
}

export const groupRepository = new GroupRepository();
