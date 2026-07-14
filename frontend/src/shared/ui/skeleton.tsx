import { cn } from '@shared/utils';
import { HTMLAttributes } from 'react';

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
    aria-hidden='true'
    {...props}
  />
);
