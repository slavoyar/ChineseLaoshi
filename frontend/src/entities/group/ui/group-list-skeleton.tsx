import { Skeleton } from '@shared/ui';
import { tileGridClassName, tileItemClassName } from '@shared/ui/tile-grid';
import { cn } from '@shared/utils';

const TILE_COUNT = 6;

const GroupTileSkeleton = () => (
  <div className={cn('flex flex-col items-center justify-between rounded-lg border bg-secondary p-2', tileItemClassName)}>
    <Skeleton className='h-7 w-7 rounded-md' />
    <div className='flex w-full flex-col items-center gap-1'>
      <Skeleton className='h-3 w-3/4' />
      <Skeleton className='h-2.5 w-1/2' />
    </div>
  </div>
);

export const GroupListSkeleton = () => (
  <div className={tileGridClassName} aria-busy='true' aria-label='Loading groups'>
    {Array.from({ length: TILE_COUNT }, (_, index) => (
      <GroupTileSkeleton key={index} />
    ))}
  </div>
);
