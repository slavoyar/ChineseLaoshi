import { useGroupStore } from '@entities/group';
import { useAuthStore } from '@shared/stores';
import { useEffect } from 'react';

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [bootstrap, isBootstrapped] = useAuthStore((state) => [state.bootstrap, state.isBootstrapped]);

  useEffect(() => {
    void (async () => {
      await bootstrap();
      void useGroupStore.getState().fetch();
    })();
  }, [bootstrap]);

  if (!isBootstrapped) {
    return null;
  }

  return children;
};
