import { USE_MOCKS } from '@shared/mocks';
import { create } from 'zustand';

interface AuthState {
  username: string;
  isDemo: boolean;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  username: USE_MOCKS ? 'Demo User' : 'User',
  isDemo: USE_MOCKS,
  signOut: () => {},
}));
