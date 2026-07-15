import { AddGroupDialog } from '@features/add-group';
import { useRequireAuth } from '@shared/hooks';
import { tileItemClassName } from '@shared/ui/tile-grid';
import { cn } from '@shared/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const CreateGroupCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { gateAction } = useRequireAuth();

  const handleClick = () => {
    gateAction(() => setIsOpen(true));
  };

  return (
    <>
      <button
        type='button'
        aria-label='Create group'
        className={cn(
          'flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-secondary/50 p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          tileItemClassName
        )}
        onClick={handleClick}
      >
        <Plus className='h-6 w-6' aria-hidden='true' />
        <span className='text-[10px] font-medium'>Create group</span>
      </button>
      <AddGroupDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
