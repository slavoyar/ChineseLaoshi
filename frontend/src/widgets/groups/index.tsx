import { CardList, useCardStore } from '@entities/card';
import { Group, GroupList } from '@entities/group';
import AddGroup from '@features/addGroup';

const Groups = () => {
  const [cardsPerGroup, fetchCards] = useCardStore((state) => [state.cardsPerGroup, state.fetch]);

  const groupOpenHandler = async (group: Group) => {
    if (!cardsPerGroup[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <div className='md:p-10 p-5 bg-secondary-900 rounded-2xl flex flex-col md:gap-10 gap-5 h-fit max-h-full'>
      <div className='flex items-center justify-between'>
        <div className='text-2xl text-white'>Folders</div>
        <AddGroup />
      </div>
      <div className='overflow-auto h-full'>
        <GroupList
          content={(item) => <CardList groupId={item.id} />}
          onGroupOpen={groupOpenHandler}
        />
      </div>
    </div>
  );
};

export default Groups;
