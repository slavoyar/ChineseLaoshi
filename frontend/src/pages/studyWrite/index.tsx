import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cardService, Card, WriteCard, useCardStore } from '@entities/card';
import { Route } from '@shared/types';

const StudyWrite = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const currentCard = useRef<Card>();

  const [isStudy, setIsStudy] = useCardStore((state) => [state.isStudy, state.setIsStudy]);

  useEffect(() => {
    if (!groupId || !isStudy) {
      navigate(Route.Root);
      return;
    }
    cardService.getCardsToStudy(groupId).then((data) => {
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
      setIsStudy(false);
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

export default StudyWrite;
