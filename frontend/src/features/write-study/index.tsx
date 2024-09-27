import { Group, useGroupStore } from '@entities/group';
import { PenWrite } from '@shared/icons/pen-write';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { CreateDialog, TextField } from '@shared/ui';
import { Autocomplete } from '@shared/ui/autocomplete';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WriteStudy = () => {
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

  const onGroupSelect = (item: Group) => {
    setSettings({ groupId: item.id });
  };

  const handleSave = () => {
    setState('write');
    const group = settings.groupId ? `/${settings.groupId}` : '';
    const route = `${Route.StudyWrite}/${settings.cardsNumber}${group}`;
    console.error(route);
    navigate(route);
  };

  return (
    <>
      <div
        className='flex flex-col gap-2 items-start justify-center w-fit p-4 bg-secondary-900 rounded-xl hover:bg-secondary-800 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <PenWrite />
        <div className='text-white text-center w-full'>Handwriting</div>
      </div>
      <CreateDialog
        title='Writing mode settings'
        isOpen={isOpen}
        saveTitle='Study'
        onSave={() => handleSave()}
        onClose={() => setIsOpen(false)}
      >
        <div className='flex flex-col gap-2'>
          <TextField
            placeholder='Number of cards'
            value={settings.cardsNumber}
            type='number'
            onChange={handleCardsNumberChange}
          />
          <Autocomplete
            placeholder='Enter group name'
            value={settings.groupId}
            items={groups}
            onSelect={onGroupSelect}
            filterableValue={(item) => item.name}
            keyValue={(item) => item.id}
          />
        </div>
      </CreateDialog>
    </>
  );
};
