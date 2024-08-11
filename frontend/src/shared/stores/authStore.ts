import { create } from 'zustand';

interface State {
  isAuth: boolean;
  username: string;
}

interface Action {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<State & Action>(() => ({
  isAuth: false,
  username: '',

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (username, password) => {
    throw new Error('Not implemented');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: (username, password) => {
    throw new Error('Not implemented');
  },
  signOut: () => {
    throw new Error('Not implemented');
  },
}));
