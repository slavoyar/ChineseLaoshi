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
import { Plus } from 'lucide-react';
import pinyin from 'pinyin';
import { useEffect, useState } from 'react';

interface Props {
  groupId: string;
}

export const AddWord = ({ groupId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [symbols, setSymbols] = useState('');

  const createWord = useCardStore((state) => state.create);
  const incrementWordCount = useGroupStore((state) => state.incrementWordCount);

  useEffect(() => {
    if (!isOpen) {
      setTranscription('');
      setTranslation('');
      setSymbols('');
    }
  }, [isOpen]);

  const saveHandler = async () => {
    try {
      await createWord(groupId, { word: { transcription, translation, symbols }, groupId });
      incrementWordCount(groupId);
    } finally {
      setIsOpen(false);
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

  return (
    <>
      <Button variant='ghost' onClick={() => setIsOpen(true)}>
        <Plus className='h-4 w-4' />
        Add word
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create word</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label htmlFor='create-word-symbols'>Hieroglyphs</Label>
              <Input
                id='create-word-symbols'
                value={symbols}
                placeholder='Enter hieroglyphs'
                onChange={(e) => symbolsHandler(e.target.value)}
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
              />
            </div>
          </div>
          <DialogFooter className='gap-2 sm:gap-0'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveHandler}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
