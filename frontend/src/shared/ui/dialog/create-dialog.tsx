import { FC } from 'react';
import { Button } from '@shared/ui';
import { DialogProps } from './types';
import { Dialog } from './dialog';

interface Props extends Omit<DialogProps, 'footer'> {
  onSave: () => void;
  saveTitle?: string;
  closeTitle?: string;
  isDisabled?: boolean;
}

export const CreateDialog: FC<Props> = ({
  onSave,
  onClose,
  isDisabled,
  saveTitle = 'Create',
  closeTitle = 'Cancel',
  ...props
}) => (
  <Dialog
    {...props}
    onClose={onClose}
    footer={
      <div className='flex w-full gap-4'>
        <Button
          className='w-full'
          variant='primary'
          disabled={isDisabled ?? false}
          onClick={() => onSave()}
        >
          {saveTitle}
        </Button>
        <Button className='w-full' variant='secondary' onClick={() => onClose()}>
          {closeTitle}
        </Button>
      </div>
    }
  />
);
