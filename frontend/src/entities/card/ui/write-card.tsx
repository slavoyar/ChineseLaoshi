import { FC, useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { useCardStore, Word } from '@entities/card';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useCounter, useDebounceValue, useResizeObserver } from '@siberiacancode/reactuse';

interface Props extends Word {
  onNext: () => void;
}

const keysBySymbols = (symbols: string, id: string) =>
  symbols.split('').map((symbol, index) => `${id}-${symbol}-${index}`);

export const WriteCard: FC<Props> = ({ id, symbols, translation, transcription, onNext }) => {
  const updateCardStats = useCardStore((state) => state.updateStats);

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
      inc();
    }
  };

  useEffect(() => {
    writers.current = symbols.split('').map((sym, index) =>
      HanziWriter.create(`hanzi-input-${index}`, sym, {
        width: fieldSize,
        height: fieldSize,
        showCharacter: false,
        showOutline: false,
        showHintAfterMisses: 3,
        drawingWidth: 20,
        strokeColor: '#31363F',
        strokeFadeDuration: 0,
        drawingFadeDuration: 0,
      })
    );
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
    await updateCardStats(id, guessed);
    onNext();
  };

  return (
    <div ref={ref} className='md:w-[500px] p-4 flex flex-col bg-secondary-900 rounded-2xl gap-4'>
      <div className='w-full bg-secondary-700 text-center text-white rounded p-2 text-xl'>
        {translation}
        <span className='ml-2 rounded text-secondary-500 bg-secondary-500 hover:bg-secondary-700'>
          ({transcription})
        </span>
      </div>
      <div className='flex justify-around items-center'>
        <Button variant='text' onClick={() => dec()} disabled={currentIndex === 0}>
          <i className={cn('fa fa-chevron-left', iconClass(currentIndex > 0))} />
        </Button>
        <div className='max-w-[300px] max-h-[300px] bg-secondary-500 rounded'>
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
      <div className='w-full flex gap-4'>
        <Button className='w-full' variant='secondary' onClick={() => buttonHandler(false)}>
          Skip
        </Button>
        <Button
          className='w-full'
          variant='primary'
          title='Enter all hieroglyphs'
          disabled={guessedSymbols.length !== symbols.length}
          onClick={() => buttonHandler(true)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WriteCard;
