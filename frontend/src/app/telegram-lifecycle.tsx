import { useAuthStore, useStudyPauseStore } from '@shared/stores';
import { isTelegramMiniApp, onTelegramActivated, onTelegramDeactivated } from '@shared/lib/telegram';
import { useEffect } from 'react';

export const TelegramLifecycle = () => {
  const signInWithTelegram = useAuthStore((state) => state.signInWithTelegram);
  const setPaused = useStudyPauseStore((state) => state.setPaused);

  useEffect(() => {
    if (!isTelegramMiniApp()) {
      return;
    }

    const offDeactivated = onTelegramDeactivated(() => setPaused(true));
    const offActivated = onTelegramActivated(() => {
      setPaused(false);
      if (useAuthStore.getState().user) {
        return;
      }
      void signInWithTelegram().catch(() => undefined);
    });

    const onVisibility = () => {
      setPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      offDeactivated();
      offActivated();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [setPaused, signInWithTelegram]);

  return null;
};
