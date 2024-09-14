import { CardList, useCardStore } from '@entities/card';
import { Group, GroupList, useGroupStore } from '@entities/group';
import { AddGroup } from '@features/add-group';
import { AddWord } from '@features/add-word';
import { HTMLAttributes } from 'react';

export const Groups = (props: HTMLAttributes<HTMLDivElement>) => {
  const [cardsPerGroup, fetchCards] = useCardStore((state) => [state.cardsPerGroup, state.fetch]);
  const decrementWordCount = useGroupStore((state) => state.decrementWordCount);

  const groupOpenHandler = async (group: Group) => {
    if (!cardsPerGroup[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <div
      className='md:p-10 p-5 bg-secondary-900 rounded-2xl flex flex-col md:gap-10 gap-5 h-fit max-h-full'
      {...props}
    >
      <div className='flex items-center justify-between'>
        <div className='text-2xl text-white'>Folders</div>
        <AddGroup />
      </div>
      <div className='overflow-auto h-full p-2'>
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
