import { Group } from '@shared/api/generated';
import { create } from 'zustand';

import groupService from '../api';

interface State {
  groups: Group[];
  isLoading: boolean;
}

interface Action {
  fetch: () => Promise<void>;
  create: (name: string) => Promise<string>;
  rename: (id: string, name: string) => Promise<void>;
  setName: (id: string, name: string) => void;
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
      set(() => ({ groups: response, isLoading: false }));
    } catch {
      set(() => ({ isLoading: false }));
    }
  },
  create: async (name: string) => {
    const response = await groupService.post({ name });
    set((state) => ({ groups: [...state.groups, response] }));
    return response.id;
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
  setName: (id: string, name: string) => {
    set((state) => ({
      groups: state.groups.map((item) => (item.id === id ? { ...item, name } : item)),
    }));
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
