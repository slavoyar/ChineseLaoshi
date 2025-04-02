import { CreateUserDto } from '@chinese-laoshi/shared';
import { authService } from '@shared/api';
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
          set(() => ({ username, isDemo: username === 'DemoUser' }));
          toast.success('Login successful', { autoClose: 500 });
        } catch {
          set(() => ({ username: '' }));
          toast.error('Invalid username or password');
        }
      },
      register: async (data: CreateUserDto) => {
        try {
          await authService.register(data);
          set(() => ({ username: data.username }));
          toast.success('Registration successful', { autoClose: 500 });
        } catch {
          set(() => ({ username: '' }));
          toast.error('Registration error');
        }
      },
      signOut: () => {
        set(() => ({ username: '' }));
        toast.success('Logout successful', { autoClose: 500 });
      },
    }),
    { name: 'auth' }
  )
);
