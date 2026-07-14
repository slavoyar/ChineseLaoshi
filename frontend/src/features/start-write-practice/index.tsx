import { useGroupStore } from '@entities/group';
import { PenWrite } from '@shared/icons/pen-write';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  GroupCombobox,
  Input,
  Label,
} from '@shared/ui';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const StartWritePractice = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [setState, setSettings, settings] = useStateStore((state) => [
    state.setState,
    state.setSettings,
    state.settings,
  ]);

  const groups = useGroupStore((state) => state.groups);

  const navigate = useNavigate();

  const handleCardsNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cardsNumber = Number(e.target.value);
    setSettings({ cardsNumber });
  };

  const handleSave = () => {
    setState(settings.prescriptionMode ? 'prescription' : 'write');
    const group = settings.groupId ? `/${settings.groupId}` : '';
    const route = `${Route.WritePractice}/${settings.cardsNumber}${group}`;
    navigate(route);
  };

  const onToggleHint = (value: boolean) => {
    setSettings({ toggleHints: value });
  };

  const onToggleMode = (value: boolean) => {
    setSettings({ prescriptionMode: value });
  };

  return (
    <>
      <Button
        variant='outline'
        className='flex h-auto w-fit flex-col items-start justify-center gap-2 rounded-xl p-4'
        onClick={() => setIsOpen(true)}
      >
        <PenWrite />
        <span className='w-full text-center'>Handwriting</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Writing mode settings</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label htmlFor='cards-number'>Number of cards</Label>
              <Input
                id='cards-number'
                placeholder='Number of cards'
                value={settings.cardsNumber}
                type='number'
                onChange={handleCardsNumberChange}
              />
            </div>
            <div className='grid gap-2'>
              <Label>Group</Label>
              <GroupCombobox
                groups={groups}
                value={settings.groupId}
                onSelect={(group) => setSettings({ groupId: group.id })}
                placeholder='Enter group name'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='toggle-hints'
                checked={settings.toggleHints}
                onCheckedChange={(checked) => onToggleHint(checked === true)}
              />
              <Label htmlFor='toggle-hints'>Toggle hints</Label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='prescription-mode'
                checked={settings.prescriptionMode}
                onCheckedChange={(checked) => onToggleMode(checked === true)}
              />
              <Label htmlFor='prescription-mode'>Prescription mode</Label>
            </div>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Study</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
