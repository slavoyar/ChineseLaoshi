import { useCardStore } from '@entities/card';
import { Word } from '@shared/api/generated';
import { useAuthStore, useStateStore } from '@shared/stores';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useCounter, useDebounceValue, useResizeObserver } from '@siberiacancode/reactuse';
import HanziWriter from 'hanzi-writer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props extends Word {
  isNextDisabled?: boolean;
  updateStats?: boolean;
  showOutline?: boolean;
  onNext: () => void;
  onComplete?: () => void;
}

const keysBySymbols = (symbols: string, id: string) =>
  symbols.split('').map((symbol, index) => `${id}-${symbol}-${index}`);

export const WriteCard = ({
  id,
  symbols,
  translation,
  transcription,
  isNextDisabled = false,
  updateStats = true,
  showOutline = false,
  onNext,
  onComplete,
}: Props) => {
  const updateCardStats = useCardStore((state) => state.updateStats);
  const isDemo = useAuthStore((state) => state.isDemo);
  const settings = useStateStore((state) => state.settings);

  const writers = useRef<HanziWriter[]>([]);
  const { value: currentIndex, inc, dec, reset } = useCounter(0);
  const debouncedIndex = useDebounceValue(currentIndex, 300);

  const [fieldSize, setFieldSize] = useState(300);
  const [guessedSymbols, setGuessedSymbols] = useState<string[]>([]);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      const { width } = entry.contentRect;
      setFieldSize(width > 400 ? 300 : 250);
    },
  });

  const onQuizComplete = ({ character }: { character: string }) => {
    setGuessedSymbols((prev) => [...prev, `${id}-${character}-${currentIndex}`]);
    if (currentIndex < symbols.length - 1) {
      setTimeout(() => inc(), 500);
    }
    if (guessedSymbols.length === symbols.length - 1 && onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    writers.current = symbols.split('').map((sym, index) =>
      HanziWriter.create(`hanzi-input-${index}`, sym, {
        width: fieldSize,
        height: fieldSize,
        showCharacter: false,
        showOutline,
        showHintAfterMisses: settings.toggleHints ? 3 : false,
        drawingWidth: 20,
        strokeColor: '#31363F',
        strokeFadeDuration: 0,
        drawingFadeDuration: 0,
      })
    );

    writers.current[0].quiz({
      onComplete: onQuizComplete,
    });

    return () => {
      writers.current.forEach((item) => {
        item.target.node.remove();
      });
      writers.current = [];
      setGuessedSymbols([]);
      reset();
    };
  }, [symbols, fieldSize]);

  useEffect(() => {
    const symbolKey = keysBySymbols(symbols, id)[debouncedIndex];
    const writer = writers.current[debouncedIndex];
    if (!writer) {
      return;
    }

    if (guessedSymbols.includes(symbolKey)) {
      writer.showCharacter();
    } else {
      writer.quiz({
        onComplete: onQuizComplete,
      });
    }
  }, [symbols, debouncedIndex]);

  const navIconClass = (enabled: boolean) =>
    cn('h-5 w-5', enabled ? 'text-foreground' : 'text-muted-foreground');

  const buttonHandler = async (guessed: boolean) => {
    onNext();
    // Demo browses the shared template; never persist template study stats.
    if (updateStats && !isDemo) {
      await updateCardStats(id, guessed);
    }
  };

  return (
    <div ref={ref} className='flex flex-col gap-4 rounded-2xl border bg-card p-4 md:w-[500px]'>
      <div className='w-full rounded-md bg-muted p-2 text-center text-xl'>
        {translation}
        <span className='ml-2 text-sm text-muted-foreground'>({transcription})</span>
      </div>
      <div className='flex items-center justify-around'>
        <Button variant='ghost' size='icon' onClick={() => dec()} disabled={currentIndex === 0}>
          <ChevronLeft className={navIconClass(currentIndex > 0)} />
        </Button>
        <div className='max-h-[300px] max-w-[300px] rounded-md bg-muted'>
          {keysBySymbols(symbols, id).map((key, index) => (
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
          disabled={currentIndex === symbols.length - 1}
          onClick={() => inc()}
        >
          <ChevronRight className={navIconClass(currentIndex < symbols.length - 1)} />
        </Button>
      </div>
      <div className='flex w-full gap-4'>
        <Button className='w-full' variant='secondary' onClick={() => buttonHandler(false)}>
          Skip
        </Button>
        <Button
          className='w-full'
          title='Enter all hieroglyphs'
          disabled={guessedSymbols.length !== symbols.length || isNextDisabled}
          onClick={() => buttonHandler(true)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WriteCard;
