import { Group, PrismaPromise } from '@prisma/client';
import type { GroupRepositoryType } from '@repositories/group.repository';

import { groups } from './group.data';

export const groupRepository: GroupRepositoryType = {
  getGroupsByUserId: jest.fn((id) => {
    return Promise.resolve(groups.filter((g) => g.userId === id)) as PrismaPromise<Group[]>;
  }),
  createGroup: jest.fn((data) => {
    return Promise.resolve({
      ...data,
      id: (groups.length + 1).toString(),
      wordCount: 0,
    }) as ReturnType<typeof groupRepository.createGroup>;
  }),
  updateGroup: jest.fn((data) => {
    return Promise.resolve({
      ...data,
    }) as ReturnType<typeof groupRepository.updateGroup>;
  }),
  deleteGroup: jest.fn(),
  incrementWordCount: jest.fn(),
  decrementWordCount: jest.fn(),
};
