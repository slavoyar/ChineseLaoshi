import { WordDto } from '@chinese-laoshi/shared';
import { useCardStore } from '@entities/card';
import { useStateStore } from '@shared/stores';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useCounter, useDebounceValue, useResizeObserver } from '@siberiacancode/reactuse';
import HanziWriter from 'hanzi-writer';
import { useEffect, useRef, useState } from 'react';

interface Props extends WordDto {
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
  const settings = useStateStore((state) => state.settings);

  const writers = useRef<HanziWriter[]>([]);
  const { value: currentIndex, inc, dec, reset } = useCounter(0);
  const debouncedIndex = useDebounceValue(currentIndex, 300);

  const [fieldSize, setFieldSize] = useState(300);
  const [guessedSymbols, setGuessedSymbols] = useState<string[]>([]);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      const { width } = entry.contentRect;

      // TODO: remove magic numbers
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

    // TODO: Refactor if possible
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

  const iconClass = (cond: boolean) => (cond ? 'text-primary-100' : 'text-secondary-700');

  const buttonHandler = async (guessed: boolean) => {
    onNext();
    if (updateStats) {
      await updateCardStats(id, guessed);
    }
  };

  return (
    <div ref={ref} className='bg-secondary-900 flex flex-col gap-4 rounded-2xl p-4 md:w-[500px]'>
      <div className='bg-secondary-700 w-full rounded p-2 text-center text-xl text-white'>
        {translation}
        <span className='text-secondary-500 bg-secondary-500 hover:bg-secondary-700 ml-2 rounded'>
          ({transcription})
        </span>
      </div>
      <div className='flex items-center justify-around'>
        <Button variant='text' onClick={() => dec()} disabled={currentIndex === 0}>
          <i className={cn('fa fa-chevron-left', iconClass(currentIndex > 0))} />
        </Button>
        <div className='bg-secondary-500 max-h-[300px] max-w-[300px] rounded'>
          {keysBySymbols(symbols, id).map((key, index) => (
            <div
              id={`hanzi-input-${index}`}
              key={key}
              className={cn(index === currentIndex ? 'block' : 'hidden')}
            />
          ))}
        </div>
        <Button variant='text' disabled={currentIndex === symbols.length - 1} onClick={() => inc()}>
          <i className={cn('fa fa-chevron-right', iconClass(currentIndex < symbols.length - 1))} />
        </Button>
      </div>
      <div className='flex w-full gap-4'>
        <Button className='w-full' variant='secondary' onClick={() => buttonHandler(false)}>
          Skip
        </Button>
        <Button
          className='w-full'
          variant='primary'
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
