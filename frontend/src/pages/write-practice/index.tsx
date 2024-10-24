import { useNavigate, useParams } from 'react-router-dom';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cardService, Card, WriteCard, useCardStore } from '@entities/card';
import { Route } from '@shared/types';
import { useStateStore } from '@shared/stores';
import { PrescriptionPractice } from '@widgets/prescription-practice';

export const WritePractice = () => {
  const navigate = useNavigate();
  const { groupId, count } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const currentCard = useRef<Card>();

  const reset = useCardStore((state) => state.reset);
  const [state, setState] = useStateStore((store) => [store.state, store.setState]);

  useEffect(() => {
    if (state === 'main' || !count) {
      navigate(Route.Root);
      return;
    }
    cardService.getCardsWritePractice(count, groupId).then((data) => {
      const [current, ...newCards] = data;
      currentCard.current = current;
      setCards(newCards);
    });
  }, []);

  const onNext = () => {
    const [current, ...newCards] = cards;
    currentCard.current = current;
    if (!currentCard.current) {
      // TODO: add notification for lesson end
      setState('main');
      reset();
      navigate(Route.Root);
    }
    setCards(newCards);
  };

  const getWidget = (): ReactNode => {
    switch (state) {
      case 'write':
        return (
          <WriteCard
            id={currentCard.current!.id}
            transcription={currentCard.current!.word.transcription}
            translation={currentCard.current!.word.translation}
            symbols={currentCard.current!.word.symbols}
            onNext={onNext}
          />
        );
      case 'prescription':
        return <PrescriptionPractice card={currentCard.current!} onNext={onNext} />;
      default:
        throw new Error('Unknown state');
    }
  };

  return (
    <div className='flex h-full items-center justify-center'>
      {currentCard.current && getWidget()}
    </div>
  );
};
