import { GROUP_ICON_CATALOG, GroupIconKey, useGroupStore } from '@entities/group';
import { testIds } from '@shared/config';
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
import { useTranslation } from 'react-i18next';

interface AddGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGroupDialog = ({ open, onOpenChange }: AddGroupDialogProps) => {
  const { t } = useTranslation();
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
      <DialogContent data-testid={testIds.group.createDialog}>
        <DialogHeader>
          <DialogTitle>{t('addGroup.title')}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='create-group-name'>{t('addGroup.nameLabel')}</Label>
            <Input
              id='create-group-name'
              data-testid={testIds.group.nameInput}
              autoFocus
              onKeyUp={handleEnter}
              placeholder={t('addGroup.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label>{t('addGroup.iconLabel')}</Label>
            <div className='grid grid-cols-4 gap-2'>
              {GROUP_ICON_CATALOG.map(({ key, Icon }) => (
                <button
                  key={key}
                  type='button'
                  aria-label={t('addGroup.selectIconAria', { icon: key })}
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
            {t('common.cancel')}
          </Button>
          <Button disabled={!name} onClick={saveHandler} data-testid={testIds.group.submit}>
            {t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
