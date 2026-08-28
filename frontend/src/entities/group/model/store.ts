import { Group, UpdateGroup } from '@shared/api';
import { create } from 'zustand';

import groupService from '../api';
import { DEFAULT_GROUP_ICON, GroupIconKey, setGroupIcon } from '../lib/group-icons';

interface State {
  groups: Group[];
  isLoading: boolean;
  hasLoaded: boolean;
}

interface Action {
  fetch: () => Promise<void>;
  create: (name: string, iconKey?: GroupIconKey) => Promise<string>;
  rename: (id: string, name: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  decrementWordCount: (id: string) => void;
  incrementWordCount: (id: string) => void;
  reset: () => void;
}

let inflightFetch: Promise<void> | null = null;
let fetchEpoch = 0;

const useGroupStore = create<State & Action>((set, get) => ({
  groups: [],
  isLoading: false,
  hasLoaded: false,
  fetch: async () => {
    if (get().hasLoaded) {
      return;
    }
    if (inflightFetch) {
      return inflightFetch;
    }

    const epoch = fetchEpoch;
    inflightFetch = (async () => {
      set(() => ({ isLoading: true }));
      try {
        const response = await groupService.getList();
        if (epoch !== fetchEpoch) {
          return;
        }
        set(() => ({ groups: response ?? [], isLoading: false, hasLoaded: true }));
      } catch {
        if (epoch !== fetchEpoch) {
          return;
        }
        set(() => ({ isLoading: false, hasLoaded: true }));
      } finally {
        if (epoch === fetchEpoch) {
          inflightFetch = null;
        }
      }
    })();

    return inflightFetch;
  },
  create: async (name: string, iconKey: GroupIconKey = DEFAULT_GROUP_ICON) => {
    const response = await groupService.post({ name });
    setGroupIcon(response.id, iconKey);
    set((state) => ({ groups: [...state.groups, response] }));
    return response.id;
  },
  rename: async (id: string, name: string) => {
    const { groups } = get();
    const groupIndex = groups.findIndex((item) => item.id === id);
    if (groupIndex < 0) {
      throw new Error(`Can not rename. Group with id = '${id}' does not exist`);
    }
    const updatedGroup = await groupService.put<UpdateGroup, Group>({ id, name });
    set((state) => ({
      groups: state.groups.map((item, index) =>
        index === groupIndex ? { ...item, ...updatedGroup, name } : item
      ),
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
  reset: () => {
    fetchEpoch += 1;
    inflightFetch = null;
    set(() => ({ groups: [], isLoading: false, hasLoaded: false }));
  },
}));

export default useGroupStore;
