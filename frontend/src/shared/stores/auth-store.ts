import { CreateUserDto } from '@chinese-laoshi/shared';
import { authService } from '@shared/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  username: string;
}

interface Action {
  login: (username: string, password: string) => Promise<void>;
  register: (data: CreateUserDto) => Promise<void>;
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
      register: async (data: CreateUserDto) => {
        try {
          await authService.register(data);
          set(() => ({ username: data.username }));
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
