import { Skeleton } from '@shared/ui';
import { tileGridClassName, tileItemClassName } from '@shared/ui/tile-grid';
import { cn } from '@shared/utils';

const WordTileSkeleton = () => (
  <div
    className={cn(
      'flex flex-col items-center justify-between rounded-lg border bg-secondary p-2',
      tileItemClassName
    )}
  >
    <Skeleton className='h-7 w-9' />
    <div className='flex w-full flex-col items-center gap-1'>
      <Skeleton className='h-2.5 w-2/3' />
      <Skeleton className='h-3 w-4/5' />
    </div>
  </div>
);

interface Props {
  count?: number;
}

export const CardListSkeleton = ({ count = 5 }: Props) => (
  <div className={tileGridClassName} aria-busy='true' aria-label='Loading words'>
    {Array.from({ length: count }, (_, index) => (
      <WordTileSkeleton key={index} />
    ))}
  </div>
);
