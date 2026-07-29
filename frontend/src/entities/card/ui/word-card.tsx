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

import { getProgressStyles } from '../lib/progress';
interface Props {
  card: Card;
  onDelete: () => void;
}

export const WordCard = ({ card, onDelete }: Props) => {
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
      <div className={cn('group/card relative', tileItemClassName)}>
        <div
          className={cn(
            'flex h-full flex-col overflow-hidden rounded-lg border-x-2 border-t-2 bg-secondary',
            progressStyles.border
          )}
          aria-label={`${card.word.symbols}, ${card.word.translation}, ${progressStyles.percentLabel}% progress`}
        >
          <div className='flex min-h-0 flex-1 flex-col items-center justify-between p-2'>
            <div className='flex flex-1 items-center justify-center'>
              <span className='text-2xl font-medium leading-none text-foreground'>{card.word.symbols}</span>
            </div>
            <div className='w-full text-center'>
              <p className='truncate text-[10px] leading-tight text-muted-foreground'>
                {card.word.transcription}
              </p>
              <p className='line-clamp-2 text-xs font-medium leading-tight text-foreground'>
                {card.word.translation}
              </p>
            </div>
          </div>
          <div className='relative flex h-3.5 shrink-0 items-center'>
            <div className='flex w-full items-center'>
              <div className={cn('h-0.5 flex-1', progressStyles.line)} />
              <span
                className={cn(
                  'mx-0.5 shrink-0 px-0.5 text-[10px] font-semibold tabular-nums leading-none',
                  progressStyles.label
                )}
              >
                {progressStyles.percentLabel}%
              </span>
              <div className={cn('h-0.5 flex-1', progressStyles.line)} />
            </div>
          </div>
        </div>
        {!isDemo && (
          <TileDeleteButton
            aria-label={`Delete word ${card.word.symbols}`}
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
            <AlertDialogTitle>Delete word</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete word{' '}
              <span className='text-lg font-medium text-foreground'>{deleteItem.word?.symbols}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteHandler}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
