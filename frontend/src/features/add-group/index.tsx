import { Button, CreateDialog, TextField } from '@shared/ui';
import { useState } from 'react';
import { useGroupStore } from '@entities/group';

export const AddGroup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const createGroup = useGroupStore((state) => state.create);

  const saveHandler = async () => {
    try {
      await createGroup(name);
    } finally {
      setIsOpen(false);
      setName('');
    }
  };
  return (
    <>
      <Button variant='secondary' onClick={() => setIsOpen(true)}>
        <i className='fa fa-add mr-1' />
        Create group
      </Button>
      <CreateDialog
        onSave={() => saveHandler()}
        isOpen={isOpen}
        title='Create group'
        onClose={() => setIsOpen(false)}
      >
        <TextField
          placeholder='Enter group name'
          onInput={(e) => setName(e.currentTarget.value)}
          value={name}
        />
      </CreateDialog>
    </>
  );
};
