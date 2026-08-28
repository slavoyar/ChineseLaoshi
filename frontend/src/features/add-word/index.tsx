import { useCardStore } from '@entities/card';
import { useGroupStore } from '@entities/group';
import { fetchPinyin, type PinyinChar } from '@shared/api';
import { isRequestCanceled } from '@shared/api/api-error';
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
import { KeyboardEvent, lazy, Suspense, useEffect, useRef, useState } from 'react';

import { PinyinPicker } from './ui/pinyin-picker';

const DrawPad = lazy(() => import('./ui/draw-pad').then((mod) => ({ default: mod.DrawPad })));
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
  const [pinyinChars, setPinyinChars] = useState<PinyinChar[]>([]);
  const [selectedReadings, setSelectedReadings] = useState<string[]>([]);
  const [drawOpen, setDrawOpen] = useState(false);
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
      setPinyinChars([]);
      setSelectedReadings([]);
      setDrawOpen(false);
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

  const applyPinyinResult = (chars: PinyinChar[], readings: string[]) => {
    setPinyinChars(chars);
    setSelectedReadings(readings);
    setTranscription(readings.join(''));
    setPinyinFailed(false);
  };

  const requestPinyin = (value: string) => {
    const requestId = ++symbolsRequestId.current;

    if (!value) {
      setTranscription('');
      setPinyinChars([]);
      setSelectedReadings([]);
      setIsPinyinPending(false);
      setPinyinFailed(false);
      return;
    }

    setIsPinyinPending(true);
    setPinyinFailed(false);
    setTranscription('');
    setPinyinChars([]);
    setSelectedReadings([]);

    void fetchPinyin(value)
      .then((result) => {
        if (requestId !== symbolsRequestId.current) {
          return;
        }
        const readings = result.characters.map((item) => item.readings[0] ?? item.char);
        applyPinyinResult(result.characters, readings);
      })
      .catch((err: unknown) => {
        if (requestId !== symbolsRequestId.current || isRequestCanceled(err)) {
          return;
        }
        setPinyinFailed(true);
        setPinyinChars([]);
        setSelectedReadings([]);
      })
      .finally(() => {
        if (requestId === symbolsRequestId.current) {
          setIsPinyinPending(false);
        }
      });
  };

  const symbolsHandler = (value: string) => {
    setSymbols(value);
    requestPinyin(value);
  };

  const appendSymbol = (char: string) => {
    const next = `${symbols}${char}`;
    setSymbols(next);
    requestPinyin(next);
  };

  const undoSymbol = () => {
    if (!symbols) {
      return;
    }
    const chars = Array.from(symbols);
    chars.pop();
    const next = chars.join('');
    setSymbols(next);
    requestPinyin(next);
  };

  const selectReading = (index: number, reading: string) => {
    const next = selectedReadings.map((value, i) => (i === index ? reading : value));
    setSelectedReadings(next);
    setTranscription(next.join(''));
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (canSave && e.key === 'Enter') {
      void saveHandler();
    }
  };

  const showPicker = !pinyinFailed && pinyinChars.length > 0;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : handleClose())}>
      <DialogContent
        className='max-h-[90vh] overflow-y-auto sm:max-w-lg'
        data-testid={testIds.word.createDialog}
      >
        <DialogHeader>
          <DialogTitle>Create word</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between gap-2'>
              <Label htmlFor='create-word-symbols'>Hieroglyphs</Label>
              <Button type='button' variant='outline' size='sm' onClick={() => setDrawOpen((prev) => !prev)}>
                {drawOpen ? 'Hide draw pad' : 'Draw'}
              </Button>
            </div>
            <Input
              id='create-word-symbols'
              data-testid={testIds.word.symbolsInput}
              autoFocus
              value={symbols}
              placeholder='Enter hieroglyphs'
              onChange={(e) => symbolsHandler(e.target.value)}
              onKeyUp={handleEnter}
            />
            {drawOpen ? (
              <Suspense
                fallback={
                  <p className='text-sm text-muted-foreground' role='status'>
                    Loading draw pad…
                  </p>
                }
              >
                <DrawPad onPick={appendSymbol} onUndoChar={undoSymbol} canUndo={symbols.length > 0} />
              </Suspense>
            ) : null}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='create-word-transcription'>Transcription</Label>
            {showPicker ? (
              <PinyinPicker
                characters={pinyinChars}
                selectedReadings={selectedReadings}
                onSelectReading={selectReading}
              />
            ) : (
              <Input
                id='create-word-transcription'
                value={transcription}
                placeholder={
                  isPinyinPending
                    ? 'Looking up pinyin…'
                    : pinyinFailed
                      ? 'Enter transcription manually'
                      : 'Enter transcription'
                }
                disabled={!pinyinFailed}
                onChange={(e) => setTranscription(e.target.value)}
                onKeyUp={handleEnter}
              />
            )}
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
              data-testid={testIds.word.translationInput}
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
          <Button disabled={!canSave} onClick={() => void saveHandler()} data-testid={testIds.word.submit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
