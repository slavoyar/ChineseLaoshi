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
    await deleteCard(deleteItem.id);
    onDelete();
  };
  return (
    <>
      <div className='bg-secondary-600 flex w-full items-center justify-between rounded-xl px-4 py-2'>
        <div className='flex items-center gap-4'>
          <div className={`w-10 text-center ${getColorByPercent(card.progress)}`}>
            <i className='fa fa-circle fa-sm' />
            <div>{getPercentFromRatio(card.progress)}%</div>
          </div>
          <div>
            {card.word.symbols}
            <span className='text-secondary-200 px-1'>({card.word.transcription})</span>-{' '}
            {card.word.translation}
          </div>
        </div>
        <i
          className='fa fa-close text-error-600 hover:bg-secondary-500 cursor-pointer rounded p-1'
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
