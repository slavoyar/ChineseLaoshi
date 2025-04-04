import { CardDto, CreateCardDto } from '@chinese-laoshi/shared';
import cardService from '@entities/card/api';
import { create } from 'zustand';

interface State {
  cardsPerGroup: Record<string, CardDto[]>;
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
  fetch: async (id: string) => {
    const response = await cardService.getList(id);
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: response } }));
  },
  create: async (id: string, data: CreateCardDto) => {
    const response = await cardService.post(data, id);
    const cards = [...get().cardsPerGroup[id], response];
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
    const card = await cardService.updateCardStats(id, guessed);

    set((state) => ({
      cardsPerGroup: {
        ...state.cardsPerGroup,
        [card.groupId]: state.cardsPerGroup[card.groupId]?.map((item) => (item.id === id ? card : item)),
      },
    }));
  },
  reset: () => {
    set(() => ({ cardsPerGroup: {} }));
  },
}));

export default useCardStore;
