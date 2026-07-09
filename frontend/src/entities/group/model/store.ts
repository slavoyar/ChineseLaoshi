import { GroupDto } from '@chinese-laoshi/shared';
import { create } from 'zustand';

import groupService from '../api';

interface State {
  groups: GroupDto[];
  isLoading: boolean;
}

interface Action {
  fetch: () => Promise<void>;
  create: (name: string) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  decrementWordCount: (id: string) => void;
  incrementWordCount: (id: string) => void;
}

const useGroupStore = create<State & Action>((set, get) => ({
  groups: [],
  isLoading: false,
  fetch: async () => {
    set(() => ({ isLoading: true }));
    try {
      const response = await groupService.getList();
      set(() => ({ groups: response.map((item) => ({ ...item, cards: [] })), isLoading: false }));
    } catch {
      set(() => ({ isLoading: false }));
    }
  },
  create: async (name: string) => {
    const response = await groupService.post({ name });
    set((state) => ({ groups: [...state.groups, { ...response, cards: [] }] }));
  },
  rename: async (id: string, name: string) => {
    const { groups } = get();
    const groupIndex = groups.findIndex((item) => item.id === id);
    if (groupIndex < 0) {
      throw new Error(`Can not rename. Group with id = '${id}' does not exist`);
    }
    const updatedGroup = { ...groups[groupIndex], name };
    await groupService.put(updatedGroup);
    groups.splice(groupIndex, 1, updatedGroup);
    set((state) => ({ groups: [...state.groups] }));
  },
  delete: async (id: string) => {
    await groupService.delete(id);
    set((state) => ({ groups: state.groups.filter((group) => group.id !== id) }));
  },
  decrementWordCount: (id: string) => {
    set((state) => ({
      groups: state.groups.map((item) => ({
        ...item,
        wordCount: item.id === id ? item.wordCount - 1 : item.wordCount,
      })),
    }));
  },
  incrementWordCount: (id: string) => {
    set((state) => ({
      groups: state.groups.map((item) => ({
        ...item,
        wordCount: item.id === id ? item.wordCount + 1 : item.wordCount,
      })),
    }));
  },
}));

export default useGroupStore;
