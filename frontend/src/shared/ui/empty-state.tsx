import { cn } from '@shared/utils';
import { HTMLAttributes, ReactNode } from 'react';

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: ReactNode;
  motif?: string;
  size?: 'default' | 'compact';
};

export const EmptyState = ({
  title,
  description,
  action,
  motif = '空',
  size = 'default',
  className,
  ...props
}: EmptyStateProps) => {
  const isCompact = size === 'compact';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isCompact ? 'gap-3 py-6' : 'gap-5 py-10',
        className
      )}
      {...props}
    >
      <div
        aria-hidden='true'
        className={cn(
          'flex items-center justify-center rounded-2xl bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]',
          isCompact ? 'size-16 text-3xl' : 'size-24 text-5xl md:size-28 md:text-6xl'
        )}
      >
        {motif}
      </div>
      <div className={cn('flex max-w-md flex-col', isCompact ? 'gap-1' : 'gap-2')}>
        <h2 className={cn('font-semibold text-foreground', isCompact ? 'text-lg' : 'text-2xl')}>
          {title}
        </h2>
        {description ? <p className='text-sm text-muted-foreground'>{description}</p> : null}
      </div>
      {action ? <div className='flex flex-wrap items-center justify-center gap-3'>{action}</div> : null}
    </div>
  );
};
