import { useAuthStore } from '@shared/stores';
import { useCallback } from 'react';

export const useRequireAuth = () => {
  const [isDemo, openDemoGate] = useAuthStore((state) => [state.isDemo, state.openDemoGate]);

  const gateAction = useCallback(
    (action: () => void) => {
      if (isDemo) {
        openDemoGate();
        return;
      }
      action();
    },
    [isDemo, openDemoGate]
  );

  return { isDemo, gateAction };
};
