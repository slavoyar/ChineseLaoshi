import { Skeleton } from '@shared/ui';

export const CardItemSkeleton = () => (
  <div className='flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-2'>
    <div className='flex min-w-0 items-center gap-4'>
      <div className='flex w-10 shrink-0 flex-col items-center gap-1'>
        <Skeleton className='h-3 w-3 rounded-full' />
        <Skeleton className='h-3 w-6' />
      </div>
      <div className='flex min-w-0 flex-1 items-center gap-1.5'>
        <Skeleton className='h-5 w-8 shrink-0' />
        <Skeleton className='h-4 w-14 shrink-0' />
        <Skeleton className='h-4 w-24 min-w-0 flex-1' />
      </div>
    </div>
    <Skeleton className='h-10 w-10 shrink-0 rounded-md' />
  </div>
);

interface Props {
  count?: number;
}

export const CardListSkeleton = ({ count = 3 }: Props) => (
  <div className='flex flex-col gap-2 py-2' aria-busy='true' aria-label='Loading words'>
    {Array.from({ length: count }, (_, index) => (
      <CardItemSkeleton key={index} />
    ))}
  </div>
);
