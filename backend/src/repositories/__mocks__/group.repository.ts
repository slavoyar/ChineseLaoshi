import { Group, PrismaPromise } from '@prisma/client';
import type { GroupRepositoryType } from '@repositories/group.repository';

export const groupRepository: GroupRepositoryType = {
  getGroupsByUserId: jest.fn(
    (): PrismaPromise<Group[]> =>
      Promise.resolve([{ id: '1', name: 'test', wordCount: 0, userId: '1' }]) as PrismaPromise<Group[]>
  ),
  createGroup: jest.fn(),
  updateGroup: jest.fn(),
  deleteGroup: jest.fn(),
  incrementWordCount: jest.fn(),
  decrementWordCount: jest.fn(),
};
