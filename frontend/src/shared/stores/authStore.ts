import { create } from 'zustand';
import { authService } from '@shared/api';
import { persist } from 'zustand/middleware';

interface State {
  username: string;
}

interface Action {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create(
  persist<State & Action>(
    (set) => ({
      username: '',

      login: async (username, password) => {
        try {
          await authService.login(username, password);
          set(() => ({ username }));
        } catch {
          set(() => ({ username: '' }));
        }
      },
      register: async (username, password) => {
        try {
          await authService.register(username, password);
          set(() => ({ username }));
        } catch {
          set(() => ({ username: '' }));
        }
      },
      signOut: () => {
        set(() => ({ username: '' }));
      },
    }),
    { name: 'auth' }
  )
);
