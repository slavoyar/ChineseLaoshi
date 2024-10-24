import { useEffect, useState } from 'react';
import { Card, WriteCard } from '@entities/card';

interface Props {
  card: Card;
  onNext: () => void;
}

interface Round {
  withOutline: boolean;
}

const HINT_ROUNDS = 5;
const ROUNDS = 5;

let rounds: Round[] = [];

export const PrescriptionPractice = ({ card, onNext }: Props) => {
  const [round, setRound] = useState(0);

  useEffect(() => {
    rounds = Array(HINT_ROUNDS + ROUNDS)
      .fill({ withOutline: false })
      .map((_, index) => ({ withOutline: index < HINT_ROUNDS }));
  }, []);

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
              isNextDisabled={round !== rounds.length - 1}
              updateStats={false}
              onNext={() => {
                if (index === rounds.length - 1) {
                  onNext();
                }
              }}
              onComplete={() => {
                setRound((prev) => (prev === rounds.length - 1 ? prev : prev + 1));
              }}
            />
          )
      )}
    </>
  );
};
