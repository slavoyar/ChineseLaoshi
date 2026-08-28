import { Button } from '@shared/ui/button';
import { cn } from '@shared/utils';
import { Trash2 } from 'lucide-react';
import { MouseEvent } from 'react';

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  'aria-label': string;
  className?: string;
  'data-testid'?: string;
}

export const TileDeleteButton = ({
  onClick,
  'aria-label': ariaLabel,
  className,
  'data-testid': dataTestId,
}: Props) => (
  <Button
    variant='ghost'
    size='icon'
    data-testid={dataTestId}
    className={cn(
      'absolute right-0 top-0 z-10 h-9 w-9 items-start justify-end p-1.5 text-muted-foreground opacity-100 transition-[opacity,color] duration-150',
      'hover:bg-transparent hover:text-red-400 active:bg-transparent active:text-red-300',
      'can-hover:opacity-0 can-hover:group-focus-within/card:opacity-100 can-hover:group-hover/card:opacity-100',
      'focus-visible:text-red-400 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500/40',
      'motion-reduce:transition-none',
      className
    )}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Trash2 className='h-3.5 w-3.5' strokeWidth={2} />
  </Button>
);
