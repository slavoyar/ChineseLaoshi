import { GroupDto } from '@chinese-laoshi/shared';
import { useGroupStore } from '@entities/group';
import { PenWrite } from '@shared/icons/pen-write';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Checkbox, CreateDialog, TextField } from '@shared/ui';
import { Autocomplete } from '@shared/ui/autocomplete';
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

  const onGroupSelect = (item: GroupDto) => {
    setSettings({ groupId: item.id });
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
      <button
        type='button'
        className='flex w-fit cursor-pointer flex-col items-start justify-center gap-2 rounded-xl bg-secondary-900 p-4 hover:bg-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
        onClick={() => setIsOpen(true)}
      >
        <PenWrite />
        <div className='w-full text-center text-white'>Handwriting</div>
      </button>
      <CreateDialog
        title='Writing mode settings'
        isOpen={isOpen}
        saveTitle='Study'
        onSave={() => handleSave()}
        onClose={() => setIsOpen(false)}
      >
        <div className='flex flex-col gap-2'>
          <label className='flex flex-col gap-1 text-sm text-secondary-200'>
            Number of cards
            <TextField
              id='write-practice-cards-number'
              placeholder='Number of cards'
              value={settings.cardsNumber}
              type='number'
              onChange={handleCardsNumberChange}
            />
          </label>
          <label className='flex flex-col gap-1 text-sm text-secondary-200'>
            Group
            <Autocomplete
              id='write-practice-group'
              placeholder='Enter group name'
              value={settings.groupId}
              items={groups}
              onSelect={onGroupSelect}
              filterableValue={(item) => item.name}
              keyValue={(item) => item.id}
            />
          </label>
          <Checkbox
            value={settings.toggleHints}
            label='Toggle hints'
            onChange={(e) => onToggleHint(e.currentTarget.checked)}
          />
          <Checkbox
            value={settings.prescriptionMode}
            label='Prescription mode'
            onChange={(e) => onToggleMode(e.currentTarget.checked)}
          />
        </div>
      </CreateDialog>
    </>
  );
};
