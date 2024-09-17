import { PenWrite } from '@shared/icons/pen-write';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { CreateDialog, TextField } from '@shared/ui';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WriteStudy = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [setState, setSettings, settings] = useStateStore((state) => [
    state.setState,
    state.setSettings,
    state.settings,
  ]);

  const navigate = useNavigate();

  const handleSave = () => {
    setState('write');
    navigate(Route.StudyWrite);
  };

  const handleCardsNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cardsNumber = Number(e.target.value);
    setSettings({ cardsNumber });
  };

  return (
    <div
      className='flex flex-col gap-2 items-start justify-center w-fit p-4 bg-secondary-900 rounded-xl hover:bg-secondary-800 cursor-pointer'
      onClick={() => setIsOpen(true)}
    >
      <PenWrite />
      <div className='text-white text-center w-full'>Handwriting</div>
      <CreateDialog
        title='Writing mode settings'
        isOpen={isOpen}
        saveTitle='Study'
        onSave={() => handleSave()}
        onClose={() => setIsOpen(false)}
      >
        <TextField
          placeholder='Number of cards'
          value={settings.cardsNumber}
          type='number'
          onChange={handleCardsNumberChange}
        />
      </CreateDialog>
    </div>
  );
};
