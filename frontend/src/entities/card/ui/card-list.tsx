import { FC } from 'react';
import { useCardStore } from '@entities/card';
import { CardItem } from './card-item';

interface Props {
  groupId: string;
  onDelete: () => void;
}

export const CardList: FC<Props> = ({ groupId, onDelete }) => {
  const cardsPerGroup = useCardStore((state) => state.cardsPerGroup);

  return (
    <div className='flex flex-col gap-2 py-2'>
      {cardsPerGroup[groupId]?.map((card) => (
        <CardItem key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
};
