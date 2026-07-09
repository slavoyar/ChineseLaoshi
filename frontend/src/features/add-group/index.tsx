import { useGroupStore } from '@entities/group';
import { Button, CreateDialog, TextField } from '@shared/ui';
import { KeyboardEvent, useState } from 'react';

export const AddGroup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const createGroup = useGroupStore((state) => state.create);

  const handleClose = () => {
    setIsOpen(false);
    setName('');
  };

  const saveHandler = async () => {
    try {
      await createGroup(name);
    } finally {
      handleClose();
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (name && e.key === 'Enter') {
      saveHandler();
    }
  };

  return (
    <>
      <Button variant='secondary' onClick={() => setIsOpen(true)}>
        <i className='fa fa-add mr-1' aria-hidden='true' />
        Create group
      </Button>
      <CreateDialog
        onSave={() => saveHandler()}
        isDisabled={!name}
        isOpen={isOpen}
        title='Create group'
        onClose={handleClose}
      >
        <label className='flex flex-col gap-1 text-sm text-secondary-200'>
          Group name
          <TextField
            id='create-group-name'
            autoFocus
            onKeyUp={handleEnter}
            placeholder='Enter group name'
            onInput={(e) => setName(e.currentTarget.value)}
            value={name}
          />
        </label>
      </CreateDialog>
    </>
  );
};
