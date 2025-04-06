import { prisma } from '@configs/prisma';
import type { PrismaClient } from '@prisma/client/extension';
import type { CreateGroupDto, UpdateGroupDto } from '@shared/types';

class GroupRepository {
  getGroupsByUserId(userId: string) {
    return prisma.group.findMany({ where: { userId } });
  }

  createGroup(data: CreateGroupDto, userId: string) {
    return prisma.group.create({ data: { ...data, userId } });
  }

  updateGroup(data: UpdateGroupDto) {
    return prisma.group.update({ where: { id: data.id }, data });
  }

  deleteGroup(id: string) {
    return prisma.group.delete({ where: { id } });
  }

  incrementWordCount(id: string, client: PrismaClient = prisma) {
    return client.group.update({ where: { id }, data: { wordCount: { increment: 1 } } });
  }

  decrementWordCount(id: string, client: PrismaClient = prisma) {
    return client.group.update({ where: { id }, data: { wordCount: { decrement: 1 } } });
  }
}

export const groupRepository = new GroupRepository();
export type GroupRepositoryType = typeof groupRepository;
