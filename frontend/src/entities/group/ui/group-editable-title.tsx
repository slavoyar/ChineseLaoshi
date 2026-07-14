import { useGroupStore } from '@entities/group';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { Check, Pencil } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface Props {
  groupId: string;
  name: string;
  className?: string;
}

export const GroupEditableTitle = ({ groupId, name, className }: Props) => {
  const setName = useGroupStore((state) => state.setName);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(name);
    }
  }, [name, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const cancelEdit = () => {
    setDraft(name);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      cancelEdit();
      return;
    }
    setName(groupId, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className={cn('flex min-w-0 items-center gap-2', className)}>
        <input
          ref={inputRef}
          type='text'
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label='Group name'
          className='min-w-0 flex-1 border-b border-primary/40 bg-transparent text-2xl text-foreground outline-none focus-visible:border-primary'
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-9 w-9 shrink-0 text-green-600 hover:bg-green-500/15 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300'
          onClick={saveEdit}
          aria-label='Save group name'
        >
          <Check className='h-4 w-4' strokeWidth={2.25} />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('group/title flex min-w-0 items-center gap-2', className)}>
      <h1 className='min-w-0 truncate text-2xl text-foreground'>{name}</h1>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn(
          'h-9 w-9 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-150',
          'hover:bg-accent hover:text-foreground',
          'group-hover/title:opacity-100 group-focus-within/title:opacity-100',
          'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
          'motion-reduce:transition-none',
        )}
        onClick={() => setIsEditing(true)}
        aria-label='Edit group name'
      >
        <Pencil className='h-4 w-4' />
      </Button>
    </div>
  );
};
