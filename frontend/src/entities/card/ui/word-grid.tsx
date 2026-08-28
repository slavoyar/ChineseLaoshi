import { useCardStore } from '@entities/card';
import { testIds } from '@shared/config';
import { useRequireAuth } from '@shared/hooks';
import { Button, EmptyState } from '@shared/ui';
import { tileGridClassName } from '@shared/ui';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardListSkeleton } from './card-list-skeleton';
import { CreateWordCard } from './create-word-card';
import { WordCard } from './word-card';

interface Props {
  groupId: string;
  wordCount?: number;
  onDelete: () => void;
  renderAddDialog: (p: { open: boolean; onOpenChange: (open: boolean) => void }) => ReactNode;
}

export const WordGrid = ({ groupId, wordCount = 0, onDelete, renderAddDialog }: Props) => {
  const { t } = useTranslation();
  const [cardsPerGroup, loadingGroupIds] = useCardStore((state) => [
    state.cardsPerGroup,
    state.loadingGroupIds,
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { gateAction } = useRequireAuth();

  const cards = cardsPerGroup[groupId];
  const isLoading = loadingGroupIds[groupId];

  if (isLoading || cards === undefined) {
    const skeletonCount = wordCount > 0 ? Math.min(wordCount, 6) : 5;
    return <CardListSkeleton count={skeletonCount} />;
  }

  if (cards.length === 0) {
    return (
      <>
        <EmptyState
          size='compact'
          data-testid={testIds.word.emptyState}
          title={t('words.emptyTitle')}
          description={t('words.emptyDescription')}
          action={
            <Button
              data-testid={testIds.word.addTrigger}
              onClick={() => gateAction(() => setIsAddOpen(true))}
            >
              <Plus aria-hidden='true' />
              {t('words.addWord')}
            </Button>
          }
        />
        {renderAddDialog({ open: isAddOpen, onOpenChange: setIsAddOpen })}
      </>
    );
  }

  return (
    <div className={tileGridClassName}>
      <CreateWordCard renderDialog={renderAddDialog} />
      {cards.map((card) => (
        <WordCard key={card.id} card={card} onDelete={onDelete} />
      ))}
    </div>
  );
};
