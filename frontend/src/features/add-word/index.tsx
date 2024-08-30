import { Button, CreateDialog, TextField } from '@shared/ui';
import { FC, useEffect, useState } from 'react';
import { useCardStore } from '@entities/card';
import { useGroupStore } from '@entities/group';
import pinyin from 'pinyin';

interface AddWordProps {
  groupId: string;
}

export const AddWord: FC<AddWordProps> = ({ groupId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [symbols, setSymbols] = useState('');

  const createWord = useCardStore((state) => state.create);
  const incrementWordCount = useGroupStore((state) => state.incrementWordCount);

  useEffect(() => {
    setTranscription('');
    setTranslation('');
    setSymbols('');
  }, [isOpen]);
  const saveHandler = async () => {
    try {
      await createWord(groupId, { transcription, translation, symbols });
      incrementWordCount(groupId);
    } finally {
      setIsOpen(false);
    }
  };

  const symbolsHandler = (value: string) => {
    // TODO: add check if it is a hieroglyph
    setSymbols(value);
    setTranscription(
      pinyin(value)
        .map((item: string[]) => item[0])
        .join('')
    );
  };

  return (
    <>
      <Button variant='text' onClick={() => setIsOpen(true)}>
        <i className='fa fa-add mr-1' />
        Add word
      </Button>
      <CreateDialog
        onSave={saveHandler}
        isOpen={isOpen}
        title='Create word'
        onClose={() => setIsOpen(false)}
      >
        <div className='flex flex-col gap-2'>
          <TextField
            value={symbols}
            placeholder='Enter hieroglyphs'
            onInput={(e) => symbolsHandler(e.currentTarget.value)}
          />
          <TextField value={transcription} placeholder='Enter transription' disabled />
          <TextField
            value={translation}
            placeholder='Enter translation'
            onInput={(e) => setTranslation(e.currentTarget.value)}
          />
        </div>
      </CreateDialog>
    </>
  );
};
