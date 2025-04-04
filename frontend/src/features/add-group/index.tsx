import { useGroupStore } from '@entities/group';
import { useAuthStore } from '@shared/stores';
import { Button, CreateDialog, TextField } from '@shared/ui';
import { KeyboardEvent, useState } from 'react';

export const AddGroup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const isDemo = useAuthStore((state) => state.isDemo);
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
      <Button
        variant='secondary'
        disabled={isDemo}
        title={isDemo ? 'Not available in demo' : ''}
        onClick={() => setIsOpen(true)}
      >
        <i className='fa fa-add mr-1' />
        Create group
      </Button>
      <CreateDialog
        onSave={() => saveHandler()}
        isDisabled={!name}
        isOpen={isOpen}
        title='Create group'
        onClose={handleClose}
      >
        <TextField
          autoFocus
          onKeyUp={handleEnter}
          placeholder='Enter group name'
          onInput={(e) => setName(e.currentTarget.value)}
          value={name}
        />
      </CreateDialog>
    </>
  );
};
