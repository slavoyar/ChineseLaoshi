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
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface AddWordDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWordDialog = ({ groupId, open, onOpenChange }: AddWordDialogProps) => {
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [symbols, setSymbols] = useState('');
  const [isPinyinPending, setIsPinyinPending] = useState(false);
  const [pinyinFailed, setPinyinFailed] = useState(false);
  const symbolsRequestId = useRef(0);

  const createWord = useCardStore((state) => state.create);
  const incrementWordCount = useGroupStore((state) => state.incrementWordCount);

  useEffect(() => {
    if (!open) {
      symbolsRequestId.current += 1;
      setIsPinyinPending(false);
      setPinyinFailed(false);
      setTranscription('');
      setTranslation('');
      setSymbols('');
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const canSave = Boolean(symbols && translation && transcription) && !isPinyinPending;

  const saveHandler = async () => {
    if (!canSave) {
      return;
    }
    try {
      await createWord(groupId, { word: { transcription, translation, symbols }, groupId });
      incrementWordCount(groupId);
    } finally {
      handleClose();
    }
  };

  const symbolsHandler = (value: string) => {
    setSymbols(value);
    const requestId = ++symbolsRequestId.current;

    if (!value) {
      setTranscription('');
      setIsPinyinPending(false);
      setPinyinFailed(false);
      return;
    }

    setIsPinyinPending(true);
    setPinyinFailed(false);
    setTranscription('');
    void import('pinyin')
      .then(({ default: pinyin }) => {
        if (requestId !== symbolsRequestId.current) {
          return;
        }
        setTranscription(
          pinyin(value)
            .map((item: string[]) => item[0])
            .join('')
        );
      })
      .catch(() => {
        if (requestId === symbolsRequestId.current) {
          setPinyinFailed(true);
        }
      })
      .finally(() => {
        if (requestId === symbolsRequestId.current) {
          setIsPinyinPending(false);
        }
      });
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (canSave && e.key === 'Enter') {
      void saveHandler();
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
              placeholder={pinyinFailed ? 'Enter transcription manually' : 'Enter transcription'}
              disabled={!pinyinFailed}
              onChange={(e) => setTranscription(e.target.value)}
              onKeyUp={handleEnter}
            />
            {pinyinFailed ? (
              <p role='status' className='text-sm text-muted-foreground'>
                Couldn’t auto-fill pinyin — enter transcription manually.
              </p>
            ) : null}
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
          <Button disabled={!canSave} onClick={() => void saveHandler()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
