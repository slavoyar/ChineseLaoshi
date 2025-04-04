import { Button } from '@shared/ui';

import { Dialog } from './dialog';
import { DialogProps } from './types';

interface Props extends Omit<DialogProps, 'footer'> {
  onDelete: () => void;
  deleteTitle?: string;
  closeTitle?: string;
  isDisabled?: boolean;
}

export const DeleteDialog = ({
  onDelete,
  onClose,
  isDisabled,
  deleteTitle = 'Delete',
  closeTitle = 'Cancel',
  ...props
}: Props) => (
  <Dialog
    {...props}
    onClose={onClose}
    footer={
      <div className='flex w-full gap-4'>
        <Button
          className='w-full'
          variant='primary'
          disabled={isDisabled ?? false}
          onClick={() => onDelete()}
        >
          {deleteTitle}
        </Button>
        <Button className='w-full' variant='secondary' onClick={() => onClose()}>
          {closeTitle}
        </Button>
      </div>
    }
  />
);
