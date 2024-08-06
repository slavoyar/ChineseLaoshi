import { FC, useCallback, useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { useCardStore, Word } from '@entities/card';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useCounter, useDebounceValue } from '@siberiacancode/reactuse';

interface Props extends Word {
  onNext: () => void;
}

const WriteCard: FC<Props> = ({ id, symbols, translation, onNext }) => {
  const updateCardStats = useCardStore((state) => state.updateStats);

  const writers = useRef<HanziWriter[]>([]);
  const { value: currentIndex, inc, dec, reset } = useCounter(0);
  const debouncedIndex = useDebounceValue(currentIndex, 300);

  const [guessedSymbols, setGuessedSymbols] = useState<string[]>([]);

  const onQuizComplete = useCallback(({ character }: { character: string }) => {
    setGuessedSymbols((prev) => [...prev, character]);
  }, []);

  useEffect(() => {
    writers.current = symbols.split('').map((sym, index) =>
      HanziWriter.create(`hanzi-input-${index}`, sym, {
        width: 300,
        height: 300,
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
      reset();
    };
  }, [symbols]);

  useEffect(() => {
    const symbol = symbols[debouncedIndex];
    if (guessedSymbols.includes(symbol)) {
      writers.current[debouncedIndex].showCharacter();
    } else {
      writers.current[debouncedIndex].quiz({
        onComplete: onQuizComplete,
      });
    }
  }, [debouncedIndex]);

  const iconClass = (cond: boolean) => (cond ? 'text-primary-100' : 'text-secondary-700');

  const buttonHandler = async (guessed: boolean) => {
    await updateCardStats(id, guessed);
    onNext();
  };

  return (
    <div className='w-[500px] p-4 flex flex-col bg-secondary-900 rounded-2xl gap-4'>
      <div className='w-full bg-secondary-700 text-center text-white rounded p-2 text-xl'>
        {translation}
      </div>
      <div className='flex justify-around items-center'>
        <Button variant='text' onClick={() => dec()} disabled={currentIndex === 0}>
          <i className={cn('fa fa-chevron-left', iconClass(currentIndex > 0))} />
        </Button>
        <div className='w-[300px] h-[300px] bg-secondary-500 rounded'>
          {symbols.split('').map((sym, index) => (
            <div
              id={`hanzi-input-${index}`}
              key={sym}
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
