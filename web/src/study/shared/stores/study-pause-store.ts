import { create } from 'zustand';

interface StudyPauseState {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

export const useStudyPauseStore = create<StudyPauseState>((set) => ({
  paused: false,
  setPaused: (paused) => set({ paused }),
}));
