import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cardService, Card, WriteCard, useCardStore } from '@entities/card';

const StudyWrite = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const currentCard = useRef<Card>();

  const [isStudy, setIsStudy] = useCardStore((state) => [state.isStudy, state.setIsStudy]);

  useEffect(() => {
    if (!groupId || !isStudy) {
      navigate('/');
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
      navigate('/');
    }
    setCards(newCards);
  };

  return (
    <div className='w-7/12 m-auto items-center h-full'>
      <div className='m-auto w-fit'>
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
    </div>
  );
};

export default StudyWrite;
