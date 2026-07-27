import { WriteCard } from '@entities/card';
import { Card } from '@shared/api/generated';
import { useEffect, useState } from 'react';

interface Props {
  card: Card;
  onNext: () => void;
}

interface Round {
  withOutline: boolean;
}

const HINT_ROUNDS = 5;
const ROUNDS = 5;

export const PrescriptionPractice = ({ card, onNext }: Props) => {
  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    setRounds(
      new Array(HINT_ROUNDS + ROUNDS)
        .fill({ withOutline: false })
        .map((_, index) => ({ withOutline: index < HINT_ROUNDS }))
    );
    setRound(0);
  }, [card]);

  return (
    <>
      {rounds.map(
        (item, index) =>
          round === index && (
            <WriteCard
              key={`${card.id}-${round}`}
              id={card.id}
              symbols={card.word.symbols}
              translation={card.word.translation}
              transcription={card.word.transcription}
              showOutline={item.withOutline}
              isNextDisabled={index !== rounds.length - 1}
              updateStats={false}
              onNext={onNext}
              onComplete={() => {
                setRound((prev) => (prev === rounds.length - 1 ? prev : prev + 1));
              }}
            />
          )
      )}
    </>
  );
};
