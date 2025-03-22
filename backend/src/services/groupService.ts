import { cardRepository, groupRepository } from '@repositories';
import type { CreateGroupDto, GroupDto, Id, UpdateGroupDto } from '@shared/types';

class GroupService {
  async getGroupsByUserId(userId: Id): Promise<GroupDto[]> {
    const groups = await groupRepository.getGroupsByUserId(userId);
    return groups.map((group) => ({ id: group.id, name: group.name, wordCount: group.wordCount }));
  }

  async createGroup(data: CreateGroupDto, userId: Id): Promise<GroupDto> {
    const group = await groupRepository.createGroup(data, userId);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async updateGroup(data: UpdateGroupDto): Promise<GroupDto> {
    const group = await groupRepository.updateGroup(data);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async deleteGroup(id: Id): Promise<void> {
    await cardRepository.deleteCardByGroupId(id);
    await groupRepository.deleteGroup(id);
  }
}

export const groupService = new GroupService();
