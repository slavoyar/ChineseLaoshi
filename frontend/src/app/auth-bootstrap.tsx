import { useAuthStore } from '@shared/stores';
import { useEffect } from 'react';

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [bootstrap, isBootstrapped] = useAuthStore((state) => [state.bootstrap, state.isBootstrapped]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  if (!isBootstrapped) {
    return null;
  }

  return children;
};
