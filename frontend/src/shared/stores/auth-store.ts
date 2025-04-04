import { CreateUserDto } from '@chinese-laoshi/shared';
import { authService } from '@shared/api';
import { DemoUser } from '@shared/consts';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  username: string;
  isDemo: boolean;
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
      isDemo: false,

      login: async (username, password) => {
        try {
          await authService.login(username, password);
          set(() => ({ username, isDemo: username === DemoUser }));
          if (username !== DemoUser) {
            toast.success('Login successful');
          }
        } catch {
          set(() => ({ username: '' }));
          toast.error('Invalid username or password');
        }
      },
      register: async (data: CreateUserDto) => {
        try {
          await authService.register(data);
          set(() => ({ username: data.username, isDemo: false }));
          toast.success('Registration successful');
        } catch {
          set(() => ({ username: '' }));
          toast.error('Registration error');
        }
      },
      signOut: () => {
        set(() => ({ username: '', isDemo: false }));
      },
    }),
    { name: 'auth' }
  )
);
