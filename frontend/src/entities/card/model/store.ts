import { CardDto, CreateCardDto } from '@chinese-laoshi/shared';
import cardService from '@entities/card/api';
import { mockCardApi, USE_MOCKS } from '@shared/mocks';
import { create } from 'zustand';

interface State {
  cardsPerGroup: Record<string, CardDto[]>;
  loadingGroupIds: Record<string, boolean>;
}

interface Action {
  fetch: (id: string) => Promise<void>;
  create: (id: string, data: CreateCardDto) => Promise<void>;
  delete: (id: string) => Promise<void>;
  updateStats: (id: string, guessed: boolean) => Promise<void>;
  reset: () => void;
}

const useCardStore = create<State & Action>((set, get) => ({
  cardsPerGroup: {},
  loadingGroupIds: {},
  fetch: async (id: string) => {
    set((state) => ({ loadingGroupIds: { ...state.loadingGroupIds, [id]: true } }));
    try {
      const response = USE_MOCKS ? await mockCardApi.getList(id) : await cardService.getList(id);
      set((state) => ({
        cardsPerGroup: { ...state.cardsPerGroup, [id]: response },
        loadingGroupIds: { ...state.loadingGroupIds, [id]: false },
      }));
    } catch {
      set((state) => ({ loadingGroupIds: { ...state.loadingGroupIds, [id]: false } }));
    }
  },
  create: async (id: string, data: CreateCardDto) => {
    const response = USE_MOCKS ? await mockCardApi.post(data, id) : await cardService.post(data, id);
    const cards = [...(get().cardsPerGroup[id] ?? []), response];
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: cards } }));
  },
  delete: async (id: string) => {
    if (USE_MOCKS) {
      await mockCardApi.delete(id);
    } else {
      await cardService.delete(id);
    }
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
    const card = USE_MOCKS
      ? await mockCardApi.updateCardStats(id, guessed)
      : await cardService.updateCardStats(id, guessed);

    set((state) => ({
      cardsPerGroup: {
        ...state.cardsPerGroup,
        [card.groupId]: state.cardsPerGroup[card.groupId]?.map((item) => (item.id === id ? card : item)),
      },
    }));
  },
  reset: () => {
    set(() => ({ cardsPerGroup: {}, loadingGroupIds: {} }));
  },
}));

export default useCardStore;
