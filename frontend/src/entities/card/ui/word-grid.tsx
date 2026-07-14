import { useCardStore } from '@entities/card';
import { tileGridClassName } from '@shared/ui/tile-grid';

import { CardListSkeleton } from './card-list-skeleton';
import { CreateWordCard } from './create-word-card';
import { WordCard } from './word-card';

interface Props {
  groupId: string;
  wordCount?: number;
  onDelete: () => void;
}

export const WordGrid = ({ groupId, wordCount = 0, onDelete }: Props) => {
  const [cardsPerGroup, loadingGroupIds] = useCardStore((state) => [
    state.cardsPerGroup,
    state.loadingGroupIds,
  ]);

  const cards = cardsPerGroup[groupId];
  const isLoading = loadingGroupIds[groupId];

  if (isLoading || cards === undefined) {
    const skeletonCount = wordCount > 0 ? Math.min(wordCount, 6) : 5;
    return <CardListSkeleton count={skeletonCount} />;
  }

  return (
    <div className={tileGridClassName}>
      <CreateWordCard groupId={groupId} />
      {cards.map((card) => (
        <WordCard key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
};
