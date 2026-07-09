import { CardDto } from '@chinese-laoshi/shared';
import { useCardStore } from '@entities/card';
import { getColorByPercent } from '@entities/card/utils';
import { useDelete } from '@shared/hooks';
import { DeleteDialog } from '@shared/ui';
import { getPercentFromRatio } from '@shared/utils';

interface Props {
  card: CardDto;
  onDelete: () => void;
}

export const CardItem = ({ card, onDelete }: Props) => {
  const deleteCard = useCardStore((state) => state.delete);

  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<CardDto>();
  const onDeleteHandler = async () => {
    closeDeleteDialog();
    await deleteCard(deleteItem.id);
    onDelete();
  };
  return (
    <>
      <div className='flex w-full items-center justify-between border-b border-secondary-600 px-2 py-3'>
        <div className='flex items-center gap-4'>
          <div className={`w-10 text-center ${getColorByPercent(card.progress)}`}>
            <i className='fa fa-circle fa-sm' aria-hidden='true' />
            <div>{getPercentFromRatio(card.progress)}%</div>
          </div>
          <div>
            {card.word.symbols}
            <span className='px-1 text-secondary-200'>({card.word.transcription})</span>-{' '}
            {card.word.translation}
          </div>
        </div>
        <button
          type='button'
          className='flex min-h-11 min-w-11 items-center justify-center rounded text-error-600 hover:bg-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
          onClick={() => openDeleteDialog(card)}
          aria-label={`Delete card ${card.word.symbols}`}
        >
          <i className='fa fa-close' aria-hidden='true' />
        </button>
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
