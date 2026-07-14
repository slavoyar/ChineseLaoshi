import { CardDto, CreateCardDto, GroupDto } from '@chinese-laoshi/shared';

import { MOCK_CARDS, MOCK_GROUPS } from './data';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let groups: GroupDto[] = structuredClone(MOCK_GROUPS);
let cards: CardDto[] = structuredClone(MOCK_CARDS);

const syncWordCounts = () => {
  groups = groups.map((group) => ({
    ...group,
    wordCount: cards.filter((card) => card.groupId === group.id).length,
  }));
};

export const mockGroupApi = {
  async getList(): Promise<GroupDto[]> {
    await delay();
    return structuredClone(groups);
  },

  async post(data: Pick<GroupDto, 'name'>): Promise<GroupDto> {
    await delay();
    const group: GroupDto = {
      id: crypto.randomUUID(),
      name: data.name,
      wordCount: 0,
    };
    groups = [...groups, group];
    return structuredClone(group);
  },

  async put(data: GroupDto): Promise<GroupDto> {
    await delay();
    groups = groups.map((group) => (group.id === data.id ? { ...group, name: data.name } : group));
    return structuredClone(data);
  },

  async delete(id: string): Promise<void> {
    await delay();
    groups = groups.filter((group) => group.id !== id);
    cards = cards.filter((card) => card.groupId !== id);
  },
};

export const mockCardApi = {
  async getList(groupId: string): Promise<CardDto[]> {
    await delay();
    return structuredClone(cards.filter((card) => card.groupId === groupId));
  },

  async post(data: CreateCardDto, _groupId: string): Promise<CardDto> {
    await delay();
    let word: CardDto['word'];

    if ('id' in data.word) {
      const existing = cards.find((card) => card.word.id === data.word.id);
      if (!existing) {
        throw new Error('Word not found');
      }
      word = existing.word;
    } else {
      word = {
        id: crypto.randomUUID(),
        symbols: data.word.symbols,
        transcription: data.word.transcription,
        translation: data.word.translation,
      };
    }

    const card: CardDto = {
      id: crypto.randomUUID(),
      groupId: data.groupId,
      progress: 0,
      showCount: 0,
      step: 0,
      isWinStreak: false,
      streak: 0,
      word,
    };
    cards = [...cards, card];
    syncWordCounts();
    return structuredClone(card);
  },

  async delete(id: string): Promise<void> {
    await delay();
    cards = cards.filter((card) => card.id !== id);
    syncWordCounts();
  },

  async updateCardStats(id: string, guessed: boolean): Promise<CardDto> {
    await delay();
    const index = cards.findIndex((card) => card.id === id);
    if (index < 0) {
      throw new Error('Card not found');
    }
    const current = cards[index];
    const progress = guessed ? Math.min(1, current.progress + 0.1) : Math.max(0, current.progress - 0.05);
    const updated = { ...current, progress, showCount: current.showCount + 1 };
    cards = [...cards.slice(0, index), updated, ...cards.slice(index + 1)];
    return structuredClone(updated);
  },

  async getCardsWritePractice(count: string, groupId?: string): Promise<CardDto[]> {
    await delay();
    const pool = groupId ? cards.filter((card) => card.groupId === groupId) : cards;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return structuredClone(shuffled.slice(0, Number(count)));
  },
};
