import { useCardStore } from '@entities/card';
import { getColorByPercent } from '@entities/card/utils';
import { Card } from '@shared/api/generated';
import { useDelete } from '@shared/hooks';
import { useAuthStore } from '@shared/stores';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@shared/ui';
import { cn, getPercentFromRatio } from '@shared/utils';
import { Circle, X } from 'lucide-react';

interface Props {
  card: Card;
  onDelete: () => void;
}

export const CardItem = ({ card, onDelete }: Props) => {
  const deleteCard = useCardStore((state) => state.delete);
  const isDemo = useAuthStore((state) => state.isDemo);

  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<Card>();
  const onDeleteHandler = async () => {
    closeDeleteDialog();
    await deleteCard(deleteItem.id);
    onDelete();
  };

  return (
    <>
      <div className='flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-2'>
        <div className='flex items-center gap-4'>
          <div
            className={cn('flex w-10 flex-col items-center text-center', getColorByPercent(card.progress))}
          >
            <Circle className='h-3 w-3 fill-current' />
            <div className='text-xs'>{getPercentFromRatio(card.progress)}%</div>
          </div>
          <div>
            {card.word.symbols}
            <span className='px-1 text-muted-foreground'>({card.word.transcription})</span>-{' '}
            {card.word.translation}
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className={cn('text-destructive hover:text-destructive', isDemo ? 'hidden' : '')}
          onClick={() => openDeleteDialog(card)}
          aria-label={`Delete card ${card.word.symbols}`}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete card{' '}
              <span className='text-lg font-medium text-foreground'>{card.word.symbols}</span>?
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
