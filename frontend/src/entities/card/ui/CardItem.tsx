import { FC } from 'react';
import { Card } from '@entities/card';
import { getPercentFromRatio } from '@shared/utils';
import { getColorByPercent } from '@entities/card/utils';

interface Props {
  card: Card;
}

const CardItem: FC<Props> = ({ card }) => (
  <div className='w-full flex rounded-xl gap-4 bg-secondary-600 px-4 py-2 items-center'>
    <div className={`text-center w-10 ${getColorByPercent(card.guessRatio)}`}>
      <i className='fa fa-circle fa-sm' />
      <div>{getPercentFromRatio(card.guessRatio)}%</div>
    </div>
    <div>
      {card.word.symbols}
      <span className='text-secondary-200 px-1'>({card.word.transcrition})</span>-{' '}
      {card.word.translation}
    </div>
  </div>
);

export default CardItem;
