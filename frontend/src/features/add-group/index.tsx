import { useGroupStore } from '@entities/group';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@shared/ui';
import { Plus } from 'lucide-react';
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
        <Plus className='h-4 w-4' />
        Create group
      </Button>
      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create group</DialogTitle>
          </DialogHeader>
          <div className='grid gap-2 py-2'>
            <Label htmlFor='create-group-name'>Group name</Label>
            <Input
              id='create-group-name'
              autoFocus
              onKeyUp={handleEnter}
              placeholder='Enter group name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={!name} onClick={saveHandler}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
