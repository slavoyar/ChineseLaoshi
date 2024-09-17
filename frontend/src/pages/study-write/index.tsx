import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cardService, Card, WriteCard, useCardStore } from '@entities/card';
import { Route } from '@shared/types';
import { useStateStore } from '@shared/stores';

export const StudyWrite = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const currentCard = useRef<Card>();

  const reset = useCardStore((state) => state.reset);
  const [state, setState] = useStateStore((store) => [store.state, store.setState]);

  useEffect(() => {
    if (state !== 'main') {
      navigate(Route.Root);
      return;
    }
    cardService.getCardsToStudy().then((data) => {
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

  return (
    <div className='flex h-full items-center justify-center'>
      {currentCard.current && (
        <WriteCard
          id={currentCard.current.id}
          transcription={currentCard.current.word.transcription}
          translation={currentCard.current.word.translation}
          symbols={currentCard.current.word.symbols}
          onNext={onNext}
        />
      )}
    </div>
  );
};
