import { Skeleton } from '@shared/ui';

export const RouteFallback = () => (
  <div
    className='m-auto flex h-full w-full max-w-3xl flex-col gap-4 p-4 md:w-9/12 xl:w-7/12'
    aria-busy='true'
    aria-label='Loading page'
  >
    <Skeleton className='h-8 w-1/3' />
    <Skeleton className='h-32 w-full' />
    <Skeleton className='h-32 w-full' />
  </div>
);
