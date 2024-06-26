import { FC } from 'react';
import { useCardStore } from '@entities/card';
import CardItem from './CardItem';

interface Props {
  groupId: string;
}
const CardList: FC<Props> = ({ groupId }) => {
  const getGroupCards = useCardStore((state) => state.getGroupCards);

  return (
    <div className='flex flex-col gap-2 py-2'>
      {getGroupCards(groupId).map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};

export default CardList;
