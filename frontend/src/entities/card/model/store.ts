import { create } from 'zustand';
import { Card } from '@entities/card';
import cardService from '@entities/card/api';

interface State {
  cardsPerGroup: Record<string, Card[]>;
}

interface Action {
  fetch: (id: string) => Promise<void>;
  getGroupCards: (id: string) => Card[];
}

const useCardStore = create<State & Action>((set, get) => ({
  cardsPerGroup: {},
  fetch: async (id: string) => {
    const response = await cardService.getList(id);
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: response } }));
  },
  getGroupCards: (id: string) => {
    const cards = get().cardsPerGroup[id];
    return cards ?? [];
  },
}));

export default useCardStore;
