import { FC } from 'react';
import { Card, useCardStore } from '@entities/card';
import { getPercentFromRatio } from '@shared/utils';
import { getColorByPercent } from '@entities/card/utils';

interface Props {
  card: Card;
  onDelete: () => void;
}

const CardItem: FC<Props> = ({ card, onDelete }) => {
  const deleteCard = useCardStore((state) => state.delete);
  const onDeleteHandler = async (id: string) => {
    await deleteCard(id);
    onDelete();
  };
  return (
    <div className='w-full flex rounded-xl bg-secondary-600 px-4 py-2 items-center justify-between'>
      <div className='flex items-center gap-4'>
        <div className={`text-center w-10 ${getColorByPercent(card.guessRatio)}`}>
          <i className='fa fa-circle fa-sm' />
          <div>{getPercentFromRatio(card.guessRatio)}%</div>
        </div>
        <div>
          {card.word.symbols}
          <span className='text-secondary-200 px-1'>({card.word.transcription})</span>-{' '}
          {card.word.translation}
        </div>
      </div>
      <i
        className='fa fa-close text-error-600 cursor-pointer hover:bg-secondary-500 p-1 rounded'
        onClick={() => onDeleteHandler(card.id)}
      />
    </div>
  );
};

export default CardItem;
