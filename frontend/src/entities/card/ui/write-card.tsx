import { useCardStore } from '@entities/card';
import { isRequestCanceled, parseApiError, Word } from '@shared/api';
import { HINT_AFTER_MISSES, HINT_SKIP_PROGRESS_THRESHOLD } from '@shared/config';
import { useAuthStore } from '@shared/stores';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useCounter, useDebounceValue, useResizeObserver } from '@siberiacancode/reactuse';
import type HanziWriterType from 'hanzi-writer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props extends Word {
  isNextDisabled?: boolean;
  updateStats?: boolean;
  showOutline?: boolean;
  onNext: () => void;
  onAbort?: () => void;
  onComplete?: () => void;
}

const symbolKeys = (symbols: string, id: string) =>
  symbols.split('').map((symbol, index) => `${id}-${symbol}-${index}`);

const cssHex = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const writerColors = () => {
  const stroke = cssHex('--hanzi-stroke');
  return {
    strokeColor: stroke,
    drawingColor: stroke,
    outlineColor: cssHex('--hanzi-outline'),
    highlightColor: cssHex('--hanzi-highlight'),
  };
};

export const WriteCard = ({
  id,
  symbols,
  translation,
  transcription,
  isNextDisabled = false,
  updateStats = true,
  showOutline = false,
  onNext,
  onAbort,
  onComplete,
}: Props) => {
  const updateCardStats = useCardStore((state) => state.updateStats);
  const isDemo = useAuthStore((state) => state.isDemo);

  const writers = useRef<HanziWriterType[]>([]);
  const isSubmittingRef = useRef(false);
  const hintCountRef = useRef(0);
  const { value: currentIndex, inc, dec, reset } = useCounter(0);
  const debouncedIndex = useDebounceValue(currentIndex, 300);

  const [fieldSize, setFieldSize] = useState(300);
  const [guessedSymbols, setGuessedSymbols] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [writersReady, setWritersReady] = useState(false);
  const [writerError, setWriterError] = useState(false);

  const skipProgress = hintCount >= HINT_SKIP_PROGRESS_THRESHOLD;
  const keys = symbolKeys(symbols, id);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      setFieldSize(entry.contentRect.width > 400 ? 300 : 250);
    },
  });

  const onHintMistake = ({ mistakesOnStroke }: { mistakesOnStroke: number }) => {
    if (mistakesOnStroke < HINT_AFTER_MISSES) {
      return;
    }
    hintCountRef.current += 1;
    setHintCount(hintCountRef.current);
  };

  const onQuizComplete = ({ character }: { character: string }) => {
    setGuessedSymbols((prev) => {
      const next = [...prev, `${id}-${character}-${currentIndex}`];
      if (next.length === symbols.length) {
        onComplete?.();
      }
      return next;
    });
    if (currentIndex < symbols.length - 1) {
      setTimeout(() => inc(), 500);
    }
  };

  const quizOpts = () => ({
    onComplete: onQuizComplete,
    onMistake: onHintMistake,
  });

  useEffect(() => {
    hintCountRef.current = 0;
    setHintCount(0);
  }, [id, symbols]);

  useEffect(() => {
    let cancelled = false;
    setWritersReady(false);
    setWriterError(false);

    void import('hanzi-writer')
      .then(({ default: HanziWriter }) => {
        if (cancelled) {
          return;
        }

        writers.current = symbols.split('').map((sym, index) =>
          HanziWriter.create(`hanzi-input-${index}`, sym, {
            width: fieldSize,
            height: fieldSize,
            showCharacter: false,
            showOutline,
            showHintAfterMisses: HINT_AFTER_MISSES,
            drawingWidth: 20,
            ...writerColors(),
            strokeFadeDuration: 0,
            drawingFadeDuration: 0,
          })
        );

        setWritersReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setWriterError(true);
        }
      });

    return () => {
      cancelled = true;
      writers.current.forEach((item) => item.target.node.remove());
      writers.current = [];
      setGuessedSymbols([]);
      setWritersReady(false);
      setWriterError(false);
      reset();
    };
  }, [symbols, fieldSize, showOutline]);

  useEffect(() => {
    if (!writersReady) {
      return;
    }
    const writer = writers.current[debouncedIndex];
    if (!writer) {
      return;
    }
    if (guessedSymbols.includes(keys[debouncedIndex])) {
      writer.showCharacter();
    } else {
      writer.quiz(quizOpts());
    }
  }, [symbols, debouncedIndex, writersReady]);

  const advance = async (guessed: boolean) => {
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;

    const cardId = id;
    const shouldUpdateStats = updateStats && !isDemo && hintCountRef.current < HINT_SKIP_PROGRESS_THRESHOLD;
    onNext();

    try {
      if (shouldUpdateStats) {
        await updateCardStats(cardId, guessed);
      }
    } catch (err) {
      if (isRequestCanceled(err)) {
        return;
      }
      if (parseApiError(err).code === 'unauthorizedError') {
        return;
      }
      onAbort?.();
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div ref={ref} className='flex w-full max-w-md flex-col gap-3 rounded-2xl border bg-card p-3 sm:gap-4 sm:p-4 md:w-[500px]'>
      {skipProgress && (
        <div
          role='status'
          className='rounded-md bg-muted px-3 py-2 text-center text-sm text-muted-foreground'
        >
          Looks like you don’t know this card yet — progress won’t update for this one.
        </div>
      )}
      {writerError && (
        <div
          role='alert'
          className='rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive'
        >
          Couldn’t load handwriting practice. Skip this card or try again.
        </div>
      )}
      <div className='w-full rounded-md bg-muted p-2 text-center text-xl'>
        {translation}
        <span className='ml-2 text-sm text-muted-foreground'>({transcription})</span>
      </div>
      <div className='flex items-center justify-around'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => dec()}
          disabled={currentIndex === 0 || !writersReady}
        >
          <ChevronLeft
            className={cn('h-5 w-5', currentIndex > 0 ? 'text-foreground' : 'text-muted-foreground')}
          />
        </Button>
        <div
          className='max-h-[300px] max-w-[300px] rounded-md bg-muted'
          aria-busy={!writersReady && !writerError}
        >
          {keys.map((key, index) => (
            <div
              id={`hanzi-input-${index}`}
              key={key}
              className={cn(index === currentIndex ? 'block' : 'hidden')}
            />
          ))}
        </div>
        <Button
          variant='ghost'
          size='icon'
          disabled={currentIndex === symbols.length - 1 || !writersReady}
          onClick={() => inc()}
        >
          <ChevronRight
            className={cn(
              'h-5 w-5',
              currentIndex < symbols.length - 1 ? 'text-foreground' : 'text-muted-foreground'
            )}
          />
        </Button>
      </div>
      <div className='flex w-full gap-4'>
        <Button className='w-full' variant='secondary' onClick={() => void advance(false)}>
          Skip
        </Button>
        <Button
          className='w-full'
          title='Enter all hieroglyphs'
          disabled={guessedSymbols.length !== symbols.length || isNextDisabled}
          onClick={() => void advance(true)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WriteCard;
