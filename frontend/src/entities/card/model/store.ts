import { create } from 'zustand';
import { Card, Word } from '@entities/card';
import cardService from '@entities/card/api';

interface State {
  cardsPerGroup: Record<string, Card[]>;
  // TODO: move isStudy state to another store
  isStudy: boolean;
}

interface Action {
  fetch: (id: string) => Promise<void>;
  create: (id: string, data: Omit<Word, 'id'>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  updateStats: (id: string, guessed: boolean) => Promise<void>;
  setIsStudy: (value: boolean) => void;
}

const useCardStore = create<State & Action>((set, get) => ({
  cardsPerGroup: {},
  isStudy: false,
  setIsStudy: (value) => {
    set(() => ({ isStudy: value }));
  },
  fetch: async (id: string) => {
    const response = await cardService.getList(id);
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: response } }));
  },
  create: async (id: string, data: Omit<Word, 'id'>) => {
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
    await cardService.updateCardStats(id, guessed);
  },
}));

export default useCardStore;
