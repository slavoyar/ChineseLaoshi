import { CardDto } from '@chinese-laoshi/shared';
import { useCardStore } from '@entities/card';
import { getColorByPercent } from '@entities/card/utils';
import { useDelete } from '@shared/hooks';
import { useAuthStore } from '@shared/stores';
import { DeleteDialog } from '@shared/ui';
import { cn, getPercentFromRatio } from '@shared/utils';

interface Props {
  card: CardDto;
  onDelete: () => void;
}

export const CardItem = ({ card, onDelete }: Props) => {
  const deleteCard = useCardStore((state) => state.delete);
  const isDemo = useAuthStore((state) => state.isDemo);

  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<CardDto>();
  const onDeleteHandler = async () => {
    closeDeleteDialog();
    await deleteCard(deleteItem.id);
    onDelete();
  };
  return (
    <>
      <div className='flex w-full items-center justify-between rounded-xl bg-secondary-600 px-4 py-2'>
        <div className='flex items-center gap-4'>
          <div className={`w-10 text-center ${getColorByPercent(card.progress)}`}>
            <i className='fa fa-circle fa-sm' />
            <div>{getPercentFromRatio(card.progress)}%</div>
          </div>
          <div>
            {card.word.symbols}
            <span className='px-1 text-secondary-200'>({card.word.transcription})</span>-{' '}
            {card.word.translation}
          </div>
        </div>
        <i
          className={cn(
            'fa fa-close cursor-pointer rounded p-1 text-error-600 hover:bg-secondary-500',
            isDemo ? 'hidden' : ''
          )}
          onClick={() => openDeleteDialog(card)}
        />
      </div>
      <DeleteDialog
        title='Delete card'
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDelete={() => onDeleteHandler()}
      >
        <div className='text-secondary-200'>
          Are you sure you want to delete card <span className='text-lg text-white'>{card.word.symbols}</span>
          ?
        </div>
      </DeleteDialog>
    </>
  );
};
