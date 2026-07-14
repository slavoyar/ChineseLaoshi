import { useCardStore } from '@entities/card';

import { CardItem } from './card-item';
import { CardListSkeleton } from './card-list-skeleton';

interface Props {
  groupId: string;
  isOpen: boolean;
  wordCount: number;
  onDelete: () => void;
}

export const CardList = ({ groupId, isOpen, wordCount, onDelete }: Props) => {
  const [cardsPerGroup, loadingGroupIds] = useCardStore((state) => [
    state.cardsPerGroup,
    state.loadingGroupIds,
  ]);

  if (!isOpen) {
    return null;
  }

  const cards = cardsPerGroup[groupId];
  const isLoading = loadingGroupIds[groupId];

  if (isLoading || cards === undefined) {
    const skeletonCount = wordCount > 0 ? Math.min(wordCount, 5) : 3;
    return <CardListSkeleton count={skeletonCount} />;
  }

  return (
    <div className='flex flex-col gap-2 py-2'>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
};
