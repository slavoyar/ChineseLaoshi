import { GroupDto } from '@chinese-laoshi/shared';
import { CardList, useCardStore } from '@entities/card';
import { GroupList, GroupListSkeleton, useGroupStore } from '@entities/group';
import { AddGroup } from '@features/add-group';
import { AddWord } from '@features/add-word';
import { cn } from '@shared/utils';
import { HTMLAttributes } from 'react';

export const Groups = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const [cardsPerGroup, fetchCards, loadingGroupIds] = useCardStore((state) => [
    state.cardsPerGroup,
    state.fetch,
    state.loadingGroupIds,
  ]);
  const [groups, isLoading] = useGroupStore((state) => [state.groups, state.isLoading]);
  const decrementWordCount = useGroupStore((state) => state.decrementWordCount);

  const groupOpenHandler = async (group: GroupDto) => {
    if (!cardsPerGroup[group.id] && !loadingGroupIds[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col gap-5 rounded-2xl border bg-card p-5 md:gap-10 md:p-10',
        className,
      )}
      {...props}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl text-foreground'>Groups</h2>
        <AddGroup />
      </div>
      <div className='min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <GroupListSkeleton />
        ) : groups.length === 0 ? (
          <div className='flex flex-col items-center gap-4 py-8 text-center text-muted-foreground'>
            <p>No groups yet. Create one to start building your vocabulary.</p>
            <AddGroup />
          </div>
        ) : (
          <GroupList
            content={(item, isOpen) => {
              const isCardsLoading = isOpen && (loadingGroupIds[item.id] || cardsPerGroup[item.id] === undefined);

              return (
                <div>
                  <CardList
                    groupId={item.id}
                    isOpen={isOpen}
                    wordCount={item.wordCount}
                    onDelete={() => decrementWordCount(item.id)}
                  />
                  {!isCardsLoading && <AddWord groupId={item.id} />}
                </div>
              );
            }}
            onGroupOpen={groupOpenHandler}
          />
        )}
      </div>
    </div>
  );
};
