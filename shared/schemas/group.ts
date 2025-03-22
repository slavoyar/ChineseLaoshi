import type { Id } from '../common';

export type GroupDto = {
  id: Id;
  name: string;
  wordCount: number;
};

export type CreateGroupDto = Pick<GroupDto, 'name'>;

export type UpdateGroupDto = Pick<GroupDto, 'name' | 'id'>;
