import { useGroupStore } from '@entities/group';
import { GROUP_ICON_CATALOG, GroupIconKey } from '@entities/group/lib/group-icons';
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
import { cn } from '@shared/utils';
import { KeyboardEvent, useState } from 'react';

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGroupDialog = ({ open, onOpenChange }: AddGroupDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<GroupIconKey>('Languages');
  const createGroup = useGroupStore((state) => state.create);

  const handleClose = () => {
    onOpenChange(false);
    setName('');
    setSelectedIcon('Languages');
  };

  const saveHandler = async () => {
    try {
      await createGroup(name, selectedIcon);
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
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : handleClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
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
          <div className='grid gap-2'>
            <Label>Icon</Label>
            <div className='grid grid-cols-4 gap-2'>
              {GROUP_ICON_CATALOG.map(({ key, Icon }) => (
                <button
                  key={key}
                  type='button'
                  aria-label={`Select ${key} icon`}
                  aria-pressed={selectedIcon === key}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg border bg-secondary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selectedIcon === key && 'border-primary ring-2 ring-primary/30'
                  )}
                  onClick={() => setSelectedIcon(key)}
                >
                  <Icon className='h-5 w-5' aria-hidden='true' />
                </button>
              ))}
            </div>
          </div>
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
  );
};
