import { useCardStore, WordGrid } from '@entities/card';
import { GroupEditableTitle, useGroupStore } from '@entities/group';
import { Route } from '@shared/types';
import { Button, EmptyState } from '@shared/ui';
import { StudyModes } from '@widgets/study-modes';
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
      <div className='m-auto flex h-full flex-col items-center justify-center md:w-9/12 xl:w-7/12'>
        <EmptyState
          motif='迷'
          title='Group not found'
          description='This group may have been deleted or the link is incorrect.'
          action={
            <Button asChild>
              <Link to={Route.Root}>Back home</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const studyDisabled = !group || group.wordCount === 0;

  return (
    <div className='m-auto flex h-full flex-col gap-6 md:w-9/12 xl:w-7/12'>
      <div className='flex min-h-0 flex-1 flex-col gap-5 md:gap-8'>
        <div className='flex flex-col gap-3'>
          <Link
            to={Route.Root}
            className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Back
          </Link>
          {group ? (
            <GroupEditableTitle
              groupId={group.id}
              name={group.name}
              className='justify-center text-center'
            />
          ) : (
            <h1 className='text-center text-2xl text-foreground'>Loading…</h1>
          )}
        </div>
        <StudyModes groupId={groupId} disabled={studyDisabled} showLabel={false} />
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
