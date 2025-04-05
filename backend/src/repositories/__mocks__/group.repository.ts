import { Group, PrismaPromise } from '@prisma/client';
import type { GroupRepositoryType } from '@repositories/group.repository';
import { getUuid, mockPrismaPromise } from '@utils';

import { groups } from './group.data';

export const groupRepository: GroupRepositoryType = {
  getGroupsByUserId: jest.fn((id) => {
    return Promise.resolve(groups.filter((g) => g.userId === id)) as PrismaPromise<Group[]>;
  }),
  createGroup: jest.fn((data) => mockPrismaPromise({ ...data, id: getUuid(groups.length + 1) })),
  updateGroup: jest.fn((data) => mockPrismaPromise(data)),
  deleteGroup: jest.fn((data) => mockPrismaPromise(data)),
  incrementWordCount: jest.fn(),
  decrementWordCount: jest.fn(),
};
