import { AuthProvider, AuthUser, InitialAuthMode } from '@shared/types/auth';
import { create } from 'zustand';

const MOCK_GOOGLE_USER: AuthUser = {
  id: 'mock-google-user',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Chen&background=f8fafc&color=0f172a',
  provider: 'google',
};

const MOCK_USERS: Record<AuthProvider, AuthUser> = {
  google: MOCK_GOOGLE_USER,
};

const getInitialUser = (): AuthUser | null => {
  const mode = (import.meta.env.VITE_INITIAL_AUTH ?? 'demo') as InitialAuthMode;
  return mode === 'authenticated' ? MOCK_GOOGLE_USER : null;
};

interface AuthState {
  user: AuthUser | null;
  isDemo: boolean;
  isAuthDialogOpen: boolean;
  isDemoGateOpen: boolean;
  signInWithProvider: (provider: AuthProvider) => void;
  signOut: () => void;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  openDemoGate: () => void;
  closeDemoGate: () => void;
  openAuthFromDemoGate: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialUser = getInitialUser();

  return {
    user: initialUser,
    isDemo: initialUser === null,
    isAuthDialogOpen: false,
    isDemoGateOpen: false,
    signInWithProvider: (provider) => {
      set({
        user: MOCK_USERS[provider],
        isDemo: false,
        isAuthDialogOpen: false,
        isDemoGateOpen: false,
      });
    },
    signOut: () => {
      set({
        user: null,
        isDemo: true,
        isAuthDialogOpen: false,
        isDemoGateOpen: false,
      });
    },
    openAuthDialog: () => set({ isAuthDialogOpen: true }),
    closeAuthDialog: () => set({ isAuthDialogOpen: false }),
    openDemoGate: () => set({ isDemoGateOpen: true }),
    closeDemoGate: () => set({ isDemoGateOpen: false }),
    openAuthFromDemoGate: () => set({ isDemoGateOpen: false, isAuthDialogOpen: true }),
  };
});
