import { cardRepository, groupRepository } from '@repositories';

import { CreateGroupDto, GroupDto, UpdateGroupDto } from '../dtos';

class GroupService {
  async getGroupsByUserId(userId: string): Promise<GroupDto[]> {
    const groups = await groupRepository.getGroupsByUserId(userId);
    return groups.map((group) => ({ id: group.id, name: group.name, wordCount: group.wordCount }));
  }

  async createGroup(data: CreateGroupDto): Promise<GroupDto> {
    const group = await groupRepository.createGroup(data);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async updateGroup(data: UpdateGroupDto): Promise<GroupDto> {
    const group = await groupRepository.updateGroup(data);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async deleteGroup(id: string): Promise<void> {
    await cardRepository.deleteCardByGroupId(id);
    await groupRepository.deleteGroup(id);
  }
}

export const groupService = new GroupService();
