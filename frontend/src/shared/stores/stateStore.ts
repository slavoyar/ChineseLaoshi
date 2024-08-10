import { create } from 'zustand';

type StateType = 'normal' | 'exercise';

interface State {
  state: StateType;
}

interface Action {
  setState: (type: StateType) => void;
}

export const useStateStore = create<State & Action>((set) => ({
  state: 'normal',
  setState: (value) => {
    set(() => ({ state: value }));
  },
}));
