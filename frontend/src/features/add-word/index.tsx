import { useCardStore } from '@entities/card';
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
import pinyin from 'pinyin';
import { KeyboardEvent, useEffect, useState } from 'react';

interface AddWordDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWordDialog = ({ groupId, open, onOpenChange }: AddWordDialogProps) => {
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [symbols, setSymbols] = useState('');

  const createWord = useCardStore((state) => state.create);
  const incrementWordCount = useGroupStore((state) => state.incrementWordCount);

  useEffect(() => {
    if (!open) {
      setTranscription('');
      setTranslation('');
      setSymbols('');
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const saveHandler = async () => {
    try {
      await createWord(groupId, { word: { transcription, translation, symbols }, groupId });
      incrementWordCount(groupId);
    } finally {
      handleClose();
    }
  };

  const symbolsHandler = (value: string) => {
    setSymbols(value);
    setTranscription(
      pinyin(value)
        .map((item: string[]) => item[0])
        .join('')
    );
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (symbols && translation && e.key === 'Enter') {
      saveHandler();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : handleClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create word</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='create-word-symbols'>Hieroglyphs</Label>
            <Input
              id='create-word-symbols'
              autoFocus
              value={symbols}
              placeholder='Enter hieroglyphs'
              onChange={(e) => symbolsHandler(e.target.value)}
              onKeyUp={handleEnter}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='create-word-transcription'>Transcription</Label>
            <Input
              id='create-word-transcription'
              value={transcription}
              placeholder='Enter transcription'
              disabled
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='create-word-translation'>Translation</Label>
            <Input
              id='create-word-translation'
              value={translation}
              placeholder='Enter translation'
              onChange={(e) => setTranslation(e.target.value)}
              onKeyUp={handleEnter}
            />
          </div>
        </div>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={!symbols || !translation} onClick={saveHandler}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
