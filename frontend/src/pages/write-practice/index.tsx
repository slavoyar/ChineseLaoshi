import { cardService, useCardStore, WriteCard } from '@entities/card';
import { isRequestCanceled } from '@shared/api';
import { Card } from '@shared/api';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { PrescriptionPractice } from '@widgets/prescription-practice';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const WritePractice = () => {
  const navigate = useNavigate();
  const { groupId, count } = useParams();
  const [current, setCurrent] = useState<Card | null>(null);
  const remainingRef = useRef<Card[]>([]);

  const reset = useCardStore((state) => state.reset);
  const [state, setState] = useStateStore((store) => [store.state, store.setState]);

  const resetAndExit = () => {
    setState('main');
    reset();
    navigate(Route.Root);
  };

  useEffect(() => {
    let active = true;

    if (state === 'main' || !count) {
      navigate(Route.Root);
      return;
    }

    cardService
      .getCardsWritePractice(count, groupId)
      .then((data) => {
        if (!active) {
          return;
        }
        const [first, ...rest] = data;
        if (!first) {
          resetAndExit();
          toast.warn('There is no enough cards for this lesson');
          return;
        }
        remainingRef.current = rest;
        setCurrent(first);
      })
      .catch((err) => {
        if (!active || isRequestCanceled(err)) {
          return;
        }
        resetAndExit();
      });

    return () => {
      active = false;
    };
  }, []);

  const onNext = () => {
    const [next, ...rest] = remainingRef.current;
    remainingRef.current = rest;
    if (!next) {
      resetAndExit();
      toast.info('The lesson is finished');
      return;
    }
    setCurrent(next);
  };

  const getWidget = (card: Card): ReactNode => {
    switch (state) {
      case 'write':
        return (
          <WriteCard
            key={card.id}
            id={card.id}
            transcription={card.word.transcription}
            translation={card.word.translation}
            symbols={card.word.symbols}
            onNext={onNext}
            onAbort={resetAndExit}
          />
        );
      case 'prescription':
        return <PrescriptionPractice key={card.id} card={card} onNext={onNext} />;
      default:
        throw new Error('Unknown state');
    }
  };

  return (
    <div className='flex h-full items-center justify-center'>{current && getWidget(current)}</div>
  );
};
