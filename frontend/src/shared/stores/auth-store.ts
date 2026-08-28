import { authApi } from '@shared/api';
import { clearSessionToken, setSessionToken } from '@shared/lib/session-token';
import { getTelegramInitData, isTelegramMiniApp } from '@shared/lib/telegram';
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
  isTelegramApp: boolean;
  isBootstrapped: boolean;
  isAuthDialogOpen: boolean;
  isDemoGateOpen: boolean;
  bootstrap: () => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithTelegram: (initData?: string) => Promise<void>;
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
  isTelegramApp: isTelegramMiniApp(),
  isBootstrapped: false,
  isAuthDialogOpen: false,
  isDemoGateOpen: false,
  bootstrap: async () => {
    if (isTelegramMiniApp()) {
      try {
        await useAuthStore.getState().signInWithTelegram(getTelegramInitData());
        set({ isBootstrapped: true });
        return;
      } catch {
        set({ user: null, isDemo: true, isTelegramApp: true, isBootstrapped: true });
        return;
      }
    }

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
  signInWithTelegram: async (initData) => {
    const payload = initData ?? getTelegramInitData();
    if (!payload) {
      throw new Error('Missing Telegram initData');
    }
    const { user, token } = await authApi.loginWithTelegram(payload);
    setSessionToken(token);
    await clearSessionCaches();
    set({
      user,
      isDemo: false,
      isTelegramApp: true,
      isAuthDialogOpen: false,
      isDemoGateOpen: false,
    });
  },
  signOut: async () => {
    try {
      if (!isTelegramMiniApp()) {
        await authApi.logout();
      }
    } finally {
      clearSessionToken();
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
