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

  async createGroup(data: CreateGroupDto) {
    try {
      await prisma.group.create({ data });
    } catch {
      throw new CustomError('entityCreateError');
    }
  }

  async updateGroup(data: UpdateGroupDto) {
    try {
      await prisma.group.update({ where: { id: data.id }, data });
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
}

export const groupRepository = new GroupRepository();
