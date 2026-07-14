import { useCardStore, WordGrid } from '@entities/card';
import { GroupEditableTitle, useGroupStore } from '@entities/group';
import { Route } from '@shared/types';
import { cn } from '@shared/utils';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export const GroupDetail = () => {
  const { groupId = '' } = useParams();
  const [groups, isLoading, fetchGroups, decrementWordCount] = useGroupStore((state) => [
    state.groups,
    state.isLoading,
    state.fetch,
    state.decrementWordCount,
  ]);
  const fetchCards = useCardStore((state) => state.fetch);

  const group = groups.find((item) => item.id === groupId);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (groupId) {
      fetchCards(groupId);
    }
  }, [groupId, fetchCards]);

  if (!isLoading && !group) {
    return (
      <div className='m-auto flex h-full flex-col items-center justify-center gap-4 md:w-9/12 xl:w-7/12'>
        <p className='text-muted-foreground'>Group not found.</p>
        <Link to={Route.Root} className='text-sm font-medium text-foreground underline-offset-4 hover:underline'>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className='m-auto flex h-full flex-col gap-6 md:w-9/12 xl:w-7/12'>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-5 rounded-2xl border bg-card p-5 md:gap-8 md:p-10',
        )}
      >
        <div className='flex flex-col gap-3'>
          <Link
            to={Route.Root}
            className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Back
          </Link>
          {group ? (
            <GroupEditableTitle groupId={group.id} name={group.name} />
          ) : (
            <h1 className='text-2xl text-foreground'>Loading…</h1>
          )}
        </div>
        <div className='min-h-0 flex-1 overflow-auto'>
          {groupId && (
            <WordGrid
              groupId={groupId}
              wordCount={group?.wordCount}
              onDelete={() => decrementWordCount(groupId)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
