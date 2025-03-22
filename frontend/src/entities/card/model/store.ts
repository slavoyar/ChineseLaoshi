import { CardDto, Id, WordDto } from '@chinese-laoshi/shared';
import cardService from '@entities/card/api';
import { create } from 'zustand';

interface State {
  cardsPerGroup: Record<Id, CardDto[]>;
}

interface Action {
  fetch: (id: Id) => Promise<void>;
  create: (id: Id, data: Omit<WordDto, 'id'>) => Promise<void>;
  delete: (id: Id) => Promise<void>;
  updateStats: (id: Id, guessed: boolean) => Promise<void>;
  reset: () => void;
}

const useCardStore = create<State & Action>((set, get) => ({
  cardsPerGroup: {},
  fetch: async (id: Id) => {
    const response = await cardService.getList(id);
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: response } }));
  },
  create: async (id: Id, data: Omit<WordDto, 'id'>) => {
    const response = await cardService.post(data, id);
    const cards = [...get().cardsPerGroup[id], response];
    set((state) => ({ cardsPerGroup: { ...state.cardsPerGroup, [id]: cards } }));
  },
  delete: async (id: Id) => {
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
  updateStats: async (id: Id, guessed: boolean) => {
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
