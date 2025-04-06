import { Group, PrismaPromise } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { GroupRepositoryType } from '@repositories/group.repository';
import { getUuid, mockPrismaPromise } from '@utils';

import { groups } from './group.data';

export const groupRepository: GroupRepositoryType = {
  getGroupsByUserId: jest.fn((id) => {
    return Promise.resolve(groups.filter((g) => g.userId === id)) as PrismaPromise<Group[]>;
  }),
  createGroup: jest.fn((data) => mockPrismaPromise({ ...data, id: getUuid(groups.length + 1) })),
  updateGroup: jest.fn((data) => mockPrismaPromise(data)),
  deleteGroup: jest.fn((id) => {
    // we expect to get a P2025 error when id is not found
    if (id === getUuid(404)) {
      throw new PrismaClientKnownRequestError('P2025', { code: 'P2025', clientVersion: '4.0.0' });
    }
    return mockPrismaPromise(id);
  }),
  incrementWordCount: jest.fn(),
  decrementWordCount: jest.fn(),
};
