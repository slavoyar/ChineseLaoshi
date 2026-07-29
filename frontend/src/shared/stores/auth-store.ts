import { authApi } from '@shared/api';
import { AuthUser } from '@shared/types';
import { create } from 'zustand';

const clearSessionCaches = async () => {
  const [{ default: useCardStore }, { default: useGroupStore }] = await Promise.all([
    import('@entities/card/model/store'),
    import('@entities/group/model/store'),
  ]);
  useCardStore.getState().reset();
  useGroupStore.getState().reset();
};

interface AuthState {
  user: AuthUser | null;
  isDemo: boolean;
  isBootstrapped: boolean;
  isAuthDialogOpen: boolean;
  isDemoGateOpen: boolean;
  bootstrap: () => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  openDemoGate: () => void;
  closeDemoGate: () => void;
  openAuthFromDemoGate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isDemo: true,
  isBootstrapped: false,
  isAuthDialogOpen: false,
  isDemoGateOpen: false,
  bootstrap: async () => {
    try {
      const user = await authApi.me();
      set({ user, isDemo: false, isBootstrapped: true });
    } catch {
      set({ user: null, isDemo: true, isBootstrapped: true });
    }
  },
  signInWithGoogle: async (idToken) => {
    const user = await authApi.loginWithGoogle(idToken);
    await clearSessionCaches();
    set({
      user,
      isDemo: false,
      isAuthDialogOpen: false,
      isDemoGateOpen: false,
    });
  },
  signOut: async () => {
    try {
      await authApi.logout();
    } finally {
      await clearSessionCaches();
      set({
        user: null,
        isDemo: true,
        isAuthDialogOpen: false,
        isDemoGateOpen: false,
      });
    }
  },
  openAuthDialog: () => set({ isAuthDialogOpen: true }),
  closeAuthDialog: () => set({ isAuthDialogOpen: false }),
  openDemoGate: () => set({ isDemoGateOpen: true }),
  closeDemoGate: () => set({ isDemoGateOpen: false }),
  openAuthFromDemoGate: () => set({ isDemoGateOpen: false, isAuthDialogOpen: true }),
}));
