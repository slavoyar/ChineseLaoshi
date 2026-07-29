import cardService from '@entities/card/api';
import { Card, CreateCard } from '@shared/api/generated';
import { create } from 'zustand';

interface State {
  cardsPerGroup: Record<string, Card[]>;
  loadingGroupIds: Record<string, boolean>;
}

interface Action {
  fetch: (id: string) => Promise<void>;
  prefetch: (id: string) => Promise<void>;
  create: (id: string, data: CreateCard) => Promise<void>;
  delete: (id: string) => Promise<void>;
  updateStats: (id: string, guessed: boolean) => Promise<void>;
  reset: () => void;
}

const inflightByGroup = new Map<string, Promise<void>>();
let fetchEpoch = 0;

const useCardStore = create<State & Action>((set, get) => ({
  cardsPerGroup: {},
  loadingGroupIds: {},
  fetch: async (id: string) => {
    if (get().cardsPerGroup[id] !== undefined) {
      return;
    }
    const existing = inflightByGroup.get(id);
    if (existing) {
      return existing;
    }

    const epoch = fetchEpoch;
    const promise = (async () => {
      set((state) => ({ loadingGroupIds: { ...state.loadingGroupIds, [id]: true } }));
      try {
        const response = await cardService.getList(id);
        if (epoch !== fetchEpoch) {
          return;
        }
        set((state) => ({
          cardsPerGroup: { ...state.cardsPerGroup, [id]: response },
          loadingGroupIds: { ...state.loadingGroupIds, [id]: false },
        }));
      } catch {
        if (epoch !== fetchEpoch) {
          return;
        }
        set((state) => ({ loadingGroupIds: { ...state.loadingGroupIds, [id]: false } }));
      } finally {
        if (epoch === fetchEpoch) {
          inflightByGroup.delete(id);
        }
      }
    })();

    inflightByGroup.set(id, promise);
    return promise;
  },
  prefetch: async (id: string) => {
    const { cardsPerGroup, loadingGroupIds } = get();
    if (cardsPerGroup[id] !== undefined || loadingGroupIds[id]) {
      return;
    }
    await get().fetch(id);
  },
  create: async (id: string, data: CreateCard) => {
    const response = await cardService.post(data);
    const cards = [...(get().cardsPerGroup[id] ?? []), response];
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: cards } }));
  },
  delete: async (id: string) => {
    await cardService.delete(id);
    const { cardsPerGroup } = get();
    const groupId = Object.keys(cardsPerGroup).find((group) =>
      cardsPerGroup[group].some((item) => item.id === id)
    );
    if (!groupId) {
      return;
    }
    set((state) => ({
      cardsPerGroup: {
        ...state.cardsPerGroup,
        [groupId]: cardsPerGroup[groupId].filter((item) => item.id !== id),
      },
    }));
  },
  updateStats: async (id: string, guessed: boolean) => {
    await cardService.updateCardStats(id, guessed);
    const epoch = fetchEpoch;
    const { cardsPerGroup } = get();
    const groupId = Object.keys(cardsPerGroup).find((group) =>
      cardsPerGroup[group].some((item) => item.id === id)
    );
    if (!groupId) {
      return;
    }
    try {
      const response = await cardService.getList(groupId);
      if (epoch !== fetchEpoch) {
        return;
      }
      set((state) => ({
        cardsPerGroup: { ...state.cardsPerGroup, [groupId]: response },
      }));
    } catch {
      // Stats already persisted; a silent list refresh failure must not fail the lesson.
    }
  },
  reset: () => {
    fetchEpoch += 1;
    inflightByGroup.clear();
    set(() => ({ cardsPerGroup: {}, loadingGroupIds: {} }));
  },
}));

export default useCardStore;
