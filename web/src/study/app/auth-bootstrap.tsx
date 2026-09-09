import { useGroupStore } from '@entities/group';
import { useAuthStore } from '@shared/stores';
import { Skeleton } from '@shared/ui';
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
    return (
      <div
        className='flex h-dvh min-h-0 w-full flex-col overflow-hidden p-2 md:px-5'
        aria-busy='true'
        aria-label='Loading application'
      >
        <Skeleton className='mb-2 h-12 w-full shrink-0' />
        <div className='m-auto flex h-full w-full max-w-3xl flex-col gap-4 p-4 md:w-9/12 xl:w-7/12'>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    );
  }

  return children;
};
