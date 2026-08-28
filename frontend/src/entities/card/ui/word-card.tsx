import { useCardStore } from '@entities/card';
import { Card } from '@shared/api';
import { useDelete, useRequireAuth } from '@shared/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  TileDeleteButton,
  tileItemClassName,
} from '@shared/ui';
import { cn } from '@shared/utils';
import { useTranslation } from 'react-i18next';

import { getProgressStyles } from '../lib/progress';
interface Props {
  card: Card;
  onDelete: () => void;
}

export const WordCard = ({ card, onDelete }: Props) => {
  const { t } = useTranslation();
  const deleteCard = useCardStore((state) => state.delete);
  const progressStyles = getProgressStyles(card.progress);
  const { isDemo } = useRequireAuth();

  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<Card>();

  const onDeleteHandler = async () => {
    closeDeleteDialog();
    await deleteCard(deleteItem.id);
    onDelete();
  };

  return (
    <>
      <div className={cn('group/card relative pb-1.5', tileItemClassName)}>
        <div
          className={cn(
            'relative flex h-full flex-col overflow-hidden rounded-lg border-2 bg-secondary',
            progressStyles.border
          )}
          aria-label={t('words.progressAria', {
            symbol: card.word.symbols,
            translation: card.word.translation,
            percent: progressStyles.percentLabel,
          })}
        >
          <div className='flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[inherit] px-2 pb-3 pt-1.5'>
            <span className='text-2xl font-medium leading-none text-foreground'>{card.word.symbols}</span>
            <div className='w-full space-y-0.5 text-center'>
              <p className='truncate text-[10px] leading-tight text-muted-foreground'>
                {card.word.transcription}
              </p>
              <p className='line-clamp-2 text-xs font-medium leading-tight text-foreground'>
                {card.word.translation}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'absolute bottom-0 left-1/2 z-10 max-w-[calc(100%-0.75rem)] -translate-x-1/2 translate-y-1/2 truncate bg-secondary px-0.5 text-[9px] font-semibold tabular-nums leading-none',
              progressStyles.label
            )}
          >
            {progressStyles.percentLabel}%
          </span>
        </div>
        {!isDemo && (
          <TileDeleteButton
            aria-label={t('words.deleteWordAria', { symbol: card.word.symbols })}
            onClick={(e) => {
              e.stopPropagation();
              openDeleteDialog(card);
            }}
          />
        )}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('words.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('words.deleteDescription')}{' '}
              <span className='text-lg font-medium text-foreground'>{deleteItem.word?.symbols}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteHandler}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
