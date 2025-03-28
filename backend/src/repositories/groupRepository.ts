import { CustomError } from '@configs/errors';
import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { CreateGroupDto, Id, UpdateGroupDto } from '@shared/types';

class GroupRepository {
  getGroupsByUserId(userId: Id) {
    try {
      return prisma.group.findMany({ where: { userId } });
    } catch {
      throw new CustomError('entityNotFoundError');
    }
  }

  createGroup(data: CreateGroupDto, userId: Id) {
    try {
      return prisma.group.create({ data: { ...data, userId } });
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

  deleteGroup(id: Id) {
    try {
      return prisma.group.delete({ where: { id } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  incrementWordCount(id: Id, client: PrismaClient = prisma) {
    try {
      return client.group.update({ where: { id }, data: { wordCount: { increment: 1 } } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }

  decrementWordCount(id: Id) {
    try {
      return prisma.group.update({ where: { id }, data: { wordCount: { decrement: 1 } } });
    } catch {
      throw new CustomError('entityDeleteError');
    }
  }
}

export const groupRepository = new GroupRepository();
