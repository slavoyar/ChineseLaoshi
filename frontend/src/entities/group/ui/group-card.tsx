import { Group } from '@shared/api/generated';
import { getGroupIcon } from '@entities/group/lib/group-icons';
import { useRequireAuth } from '@shared/hooks';
import { TileDeleteButton } from '@shared/ui';
import { tileItemClassName } from '@shared/ui/tile-grid';
import { cn } from '@shared/utils';
import { KeyboardEvent } from 'react';

interface Props {
  group: Group;
  onNavigate: () => void;
  onDelete: () => void;
}

export const GroupCard = ({ group, onNavigate, onDelete }: Props) => {
  const Icon = getGroupIcon(group.id);
  const { isDemo } = useRequireAuth();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate();
    }
  };

  return (
    <div className={cn('group/card relative', tileItemClassName)}>
      <div
        role='button'
        tabIndex={0}
        aria-label={`Open group ${group.name}`}
        className='flex h-full cursor-pointer flex-col items-center justify-between rounded-lg border bg-secondary p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        onClick={onNavigate}
        onKeyDown={handleKeyDown}
      >
        <div className='flex flex-1 items-center justify-center'>
          <Icon className='h-7 w-7 text-foreground' aria-hidden='true' />
        </div>
        <div className='w-full text-center'>
          <p className='line-clamp-2 text-xs font-medium leading-tight text-foreground'>{group.name}</p>
          <p className='mt-0.5 text-[10px] text-muted-foreground'>
            {group.wordCount} {group.wordCount === 1 ? 'word' : 'words'}
          </p>
        </div>
      </div>
      {!isDemo && (
        <TileDeleteButton
          aria-label={`Delete group ${group.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      )}
    </div>
  );
};
