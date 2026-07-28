import { Button } from '@shared/ui/button';
import { cn } from '@shared/utils';
import { Trash2 } from 'lucide-react';
import { MouseEvent } from 'react';

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  'aria-label': string;
  className?: string;
}

export const TileDeleteButton = ({ onClick, 'aria-label': ariaLabel, className }: Props) => (
  <Button
    variant='ghost'
    size='icon'
    className={cn(
      'absolute right-0.5 top-0.5 z-10 h-9 w-9 text-red-500 opacity-0 transition-[opacity,color] duration-150',
      'hover:bg-transparent hover:text-red-300 active:bg-transparent active:text-red-200',
      'group-hover/card:opacity-100',
      'group-focus-within/card:opacity-100',
      'focus-visible:text-red-300 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500/50',
      'motion-reduce:transition-none',
      className
    )}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Trash2 className='h-4 w-4 drop-shadow-sm' strokeWidth={2.25} />
  </Button>
);
