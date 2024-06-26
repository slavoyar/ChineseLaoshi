import { CardList, useCardStore } from '@entities/card';
import { Group, GroupList } from '@entities/group';

const Groups = () => {
  const [cardsPerGroup, fetchCards] = useCardStore((state) => [state.cardsPerGroup, state.fetch]);

  const groupOpenHandler = async (group: Group) => {
    if (!cardsPerGroup[group.id]) {
      await fetchCards(group.id);
    }
  };

  return (
    <GroupList content={(item) => <CardList groupId={item.id} />} onGroupOpen={groupOpenHandler} />
  );
};

export default Groups;
