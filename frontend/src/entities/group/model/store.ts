import { create } from 'zustand';
import { Group } from '@entities/group/model/types';
import groupService from '@entities/group/api';

interface State {
  groups: Group[];
}

interface Action {
  fetch: () => Promise<void>;
  create: (name: string) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

const useGroupStore = create<State & Action>((set, get) => ({
  groups: [],
  fetch: async () => {
    const response = await groupService.getList();
    set(() => ({ groups: response.map((item) => ({ ...item, cards: [] })) }));
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
}));

export default useGroupStore;
