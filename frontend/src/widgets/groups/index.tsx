import { GroupDto } from '@chinese-laoshi/shared';
import { CardList, useCardStore } from '@entities/card';
import { GroupList, useGroupStore } from '@entities/group';
import { AddGroup } from '@features/add-group';
import { AddWord } from '@features/add-word';
import { HTMLAttributes } from 'react';

export const Groups = (props: HTMLAttributes<HTMLDivElement>) => {
  const [cardsPerGroup, fetchCards] = useCardStore((state) => [state.cardsPerGroup, state.fetch]);
  const decrementWordCount = useGroupStore((state) => state.decrementWordCount);

  const groupOpenHandler = async (group: GroupDto) => {
    if (!cardsPerGroup[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <div
      className='bg-secondary-900 flex h-fit max-h-full flex-col gap-5 rounded-2xl p-5 md:gap-10 md:p-10'
      {...props}
    >
      <div className='flex items-center justify-between'>
        <div className='text-2xl text-white'>Folders</div>
        <AddGroup />
      </div>
      <div className='h-full overflow-auto p-2'>
        <GroupList
          content={(item) => (
            <div>
              <CardList groupId={item.id} onDelete={() => decrementWordCount(item.id)} />
              <AddWord groupId={item.id} />
            </div>
          )}
          onGroupOpen={groupOpenHandler}
        />
      </div>
    </div>
  );
};
