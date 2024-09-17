import { create } from 'zustand';

type StateType = 'main' | 'write';

interface StudySettings {
  cardsNumber: number;
  groupId?: string;
}

const DEFAULT_SETTINGS: StudySettings = {
  cardsNumber: 20,
};

interface State {
  state: StateType;
  settings: StudySettings;
}

interface Action {
  setState: (type: StateType) => void;
  setSettings: (settings: Partial<StudySettings>) => void;
}

export const useStateStore = create<State & Action>((set, get) => ({
  state: 'main',
  settings: DEFAULT_SETTINGS,
  setState: (value) => {
    set(() => ({ state: value }));
  },
  setSettings: (settings) => {
    const currentSettings = get().settings;
    set(() => ({ settings: { ...currentSettings, settings } }));
  },
}));
