import { GroupDto } from '@chinese-laoshi/shared';
import { CardList, useCardStore } from '@entities/card';
import { GroupList, useGroupStore } from '@entities/group';
import { AddGroup } from '@features/add-group';
import { AddWord } from '@features/add-word';
import { HTMLAttributes } from 'react';

export const Groups = (props: HTMLAttributes<HTMLDivElement>) => {
  const [cardsPerGroup, fetchCards] = useCardStore((state) => [state.cardsPerGroup, state.fetch]);
  const [groups, isLoading, decrementWordCount] = useGroupStore((state) => [
    state.groups,
    state.isLoading,
    state.decrementWordCount,
  ]);

  const groupOpenHandler = async (group: GroupDto) => {
    if (!cardsPerGroup[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <div
      className='flex min-h-0 flex-col gap-5 rounded-2xl bg-secondary-900 p-5 md:gap-10 md:p-10'
      {...props}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl text-white'>Groups</h2>
        <AddGroup />
      </div>
      <div className='min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <p className='text-secondary-200'>Loading groups...</p>
        ) : groups.length === 0 ? (
          <div className='flex flex-col items-center gap-4 py-8 text-center text-secondary-200'>
            <p>No groups yet. Create your first group to start studying.</p>
            <AddGroup />
          </div>
        ) : (
          <GroupList
            content={(item) => (
              <div>
                <CardList groupId={item.id} onDelete={() => decrementWordCount(item.id)} />
                <AddWord groupId={item.id} />
              </div>
            )}
            onGroupOpen={groupOpenHandler}
          />
        )}
      </div>
    </div>
  );
};
