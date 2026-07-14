import { Skeleton } from '@shared/ui';

const ROW_COUNT = 3;

export const GroupListSkeleton = () => (
  <div className='flex flex-col' aria-busy='true' aria-label='Loading groups'>
    {Array.from({ length: ROW_COUNT }, (_, index) => (
      <div key={index} className='border-b'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-1 items-center justify-between py-4'>
            <Skeleton className='h-5 w-48 max-w-[calc(100%-2rem)]' />
            <Skeleton className='h-4 w-4 shrink-0' />
          </div>
          <Skeleton className='h-10 w-10 shrink-0 rounded-md' />
        </div>
      </div>
    ))}
  </div>
);
