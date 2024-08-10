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

  login: (username, password) => {
    console.log(username, password);
    throw new Error('Not implemented');
  },
  register: (username, password) => {
    console.log(username, password);
    throw new Error('Not implemented');
  },
  signOut: () => {
    throw new Error('Not implemented');
  },
}));
