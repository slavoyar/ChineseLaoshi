import { Card, useCardStore } from '@entities/card';
import { getColorByPercent } from '@entities/card/utils';
import { getPercentFromRatio } from '@shared/utils';
import { FC } from 'react';

interface Props {
  card: Card;
  onDelete: () => void;
}

export const CardItem: FC<Props> = ({ card, onDelete }) => {
  const deleteCard = useCardStore((state) => state.delete);
  const onDeleteHandler = async (id: string) => {
    await deleteCard(id);
    onDelete();
  };
  return (
    <div className='bg-secondary-600 flex w-full items-center justify-between rounded-xl px-4 py-2'>
      <div className='flex items-center gap-4'>
        <div className={`w-10 text-center ${getColorByPercent(card.progress)}`}>
          <i className='fa fa-circle fa-sm' />
          <div>{getPercentFromRatio(card.progress)}%</div>
        </div>
        <div>
          {card.word.symbols}
          <span className='text-secondary-200 px-1'>({card.word.transcription})</span>- {card.word.translation}
        </div>
      </div>
      <i
        className='fa fa-close text-error-600 hover:bg-secondary-500 cursor-pointer rounded p-1'
        onClick={() => onDeleteHandler(card.id)}
      />
    </div>
  );
};
