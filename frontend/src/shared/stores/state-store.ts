import { StudyMode } from '@shared/config/study';
import { create } from 'zustand';

type StateType = 'main' | StudyMode;

interface State {
  state: StateType;
}

interface Action {
  setState: (type: StateType) => void;
}

export const useStateStore = create<State & Action>((set) => ({
  state: 'main',
  setState: (value) => {
    set(() => ({ state: value }));
  },
}));
