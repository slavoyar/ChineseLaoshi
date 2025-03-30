import { prisma } from '@configs/prisma';
import { cardRepository, groupRepository, wordRepository } from '@repositories';
import type { CreateGroupDto, GroupDto, UpdateGroupDto } from '@shared/types';

class GroupService {
  async getGroupsByUserId(userId: string): Promise<GroupDto[]> {
    const groups = await groupRepository.getGroupsByUserId(userId);
    return groups.map((group) => ({ id: group.id, name: group.name, wordCount: group.wordCount }));
  }

  async createGroup(data: CreateGroupDto, userId: string): Promise<GroupDto> {
    const group = await groupRepository.createGroup(data, userId);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async updateGroup(data: UpdateGroupDto): Promise<GroupDto> {
    const group = await groupRepository.updateGroup(data);
    return { id: group.id, name: group.name, wordCount: group.wordCount };
  }

  async deleteGroup(id: string): Promise<void> {
    const cards = await cardRepository.getCardsByGroupId(id);
    const wordIds = cards.map((card) => card.wordId);
    const wordsInOtherGroups = await wordRepository.getWordsInOtherGroups(id, wordIds);

    const singleUsageWordIds = wordIds.filter(
      (wordId) => !wordsInOtherGroups.some((word) => word.wordId === wordId)
    );

    const transactionArray = [cardRepository.deleteCardByGroupId(id), groupRepository.deleteGroup(id)];
    if (singleUsageWordIds.length) {
      transactionArray.push(wordRepository.deleteWords(singleUsageWordIds));
    }

    await prisma.$transaction(transactionArray);
  }
}

export const groupService = new GroupService();
