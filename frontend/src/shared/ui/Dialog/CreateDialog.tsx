import { FC } from 'react';
import { Button } from '@shared/ui';
import Dialog from './Dialog';
import { DialogProps } from './types';

interface Props extends Omit<DialogProps, 'footer'> {
  onSave: () => void;
  saveTitle?: string;
  closeTitle?: string;
}

const CreateDialog: FC<Props> = ({
  onSave,
  onClose,
  saveTitle = 'Create',
  closeTitle = 'Cancel',
  ...props
}) => (
  <Dialog
    {...props}
    onClose={onClose}
    footer={
      <div className='flex w-full gap-4'>
        <Button variant='primary' onClick={() => onSave()}>
          {saveTitle}
        </Button>
        <Button variant='secondary' onClick={() => onClose()}>
          {closeTitle}
        </Button>
      </div>
    }
  />
);

export default CreateDialog;
