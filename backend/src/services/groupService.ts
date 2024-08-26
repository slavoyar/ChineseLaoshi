import { CreateGroupDto } from '../dtos';

class GroupService {
  getGroupsByUserId(userId: string) {
    throw new Error('Not implemented');
  }

  createGroup(data: CreateGroupDto): Promise<void> {
    throw new Error('Not implemented');
  }

  updateGroup(data: CreateGroupDto): Promise<void> {
    throw new Error('Not implemented');
  }

  deleteGroup(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const groupService = new GroupService();
