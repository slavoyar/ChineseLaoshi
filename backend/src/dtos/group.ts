import { Group } from '@prisma/client';

export type GroupDto = Pick<Group, 'id' | 'name' | 'wordCount'>;

export type CreateGroupDto = Pick<Group, 'name' | 'userId'>;

export type UpdateGroupDto = Pick<Group, 'name' | 'id'>;
