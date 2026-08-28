import { cardService, useCardStore, WriteCard } from '@entities/card';
import { QuizCard } from '@features/study-quiz';
import { isRequestCanceled } from '@shared/api';
import { Card } from '@shared/api';
import { MixedFace, StudyMode } from '@shared/config';
import {
  assignMixedFaces,
  clearStudySession,
  loadStudySession,
  saveStudySession,
} from '@shared/lib/study-session';
import { useStateStore, useStudyPauseStore } from '@shared/stores';
import { Route } from '@shared/types';
import { PrescriptionPractice } from '@widgets/prescription-practice';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const WritePractice = () => {
  const navigate = useNavigate();
  const { groupId, count } = useParams();
  const [current, setCurrent] = useState<Card | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sessionCardsRef = useRef<Card[]>([]);
  const cardFacesRef = useRef<Record<string, MixedFace>>({});
  const remainingRef = useRef<Card[]>([]);
  const sessionModeRef = useRef<'main' | StudyMode>('main');
  const paused = useStudyPauseStore((state) => state.paused);

  const reset = useCardStore((state) => state.reset);
  const [state, setState] = useStateStore((store) => [store.state, store.setState]);

  const resetAndExit = () => {
    clearStudySession();
    setState('main');
    reset();
    navigate(Route.Root);
  };

  const persistSession = (
    mode: 'main' | StudyMode,
    cards: Card[],
    index: number,
    faces: Record<string, MixedFace>,
  ) => {
    if (mode === 'main' || !count) {
      return;
    }
    saveStudySession({
      mode,
      groupId,
      count,
      cards,
      currentIndex: index,
      cardFaces: mode === 'mixed' ? faces : undefined,
    });
  };

  const restoreFromSnapshot = (): boolean => {
    const snapshot = loadStudySession();
    if (!snapshot || snapshot.count !== count) {
      return false;
    }
    if ((snapshot.groupId ?? undefined) !== groupId) {
      return false;
    }
    if (snapshot.cards.length === 0) {
      return false;
    }
    if (state !== 'main' && snapshot.mode !== state) {
      return false;
    }

    if (state === 'main') {
      sessionModeRef.current = snapshot.mode;
      setState(snapshot.mode);
    }

    sessionCardsRef.current = snapshot.cards;
    cardFacesRef.current = snapshot.cardFaces ?? {};
    const index = Math.min(snapshot.currentIndex, snapshot.cards.length - 1);
    const currentCard = snapshot.cards[index];
    const rest = snapshot.cards.slice(index + 1);
    remainingRef.current = rest;
    setCurrentIndex(index);
    setCurrent(currentCard);
    return true;
  };

  useEffect(() => {
    let active = true;

    if (!count) {
      navigate(Route.Root);
      return;
    }

    if (restoreFromSnapshot()) {
      return () => {
        active = false;
      };
    }

    if (state === 'main') {
      navigate(Route.Root);
      return;
    }

    cardService
      .getCardsWritePractice(count, groupId)
      .then((data) => {
        if (!active) {
          return;
        }
        if (data.length === 0) {
          resetAndExit();
          toast.warn('There is no enough cards for this lesson');
          return;
        }

        sessionCardsRef.current = data;
        if (state === 'mixed') {
          cardFacesRef.current = assignMixedFaces(data);
        }
        sessionModeRef.current = state;

        const [first, ...rest] = data;
        remainingRef.current = rest;
        setCurrentIndex(0);
        setCurrent(first);
        persistSession(state, data, 0, cardFacesRef.current);
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
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrent(next);
    persistSession(state, sessionCardsRef.current, nextIndex, cardFacesRef.current);
  };

  const renderFace = (card: Card, face: MixedFace): ReactNode => {
    switch (face) {
      case 'write':
        return (
          <WriteCard
            key={card.id}
            id={card.id}
            transcription={card.word.transcription}
            translation={card.word.translation}
            symbols={card.word.symbols}
            paused={paused}
            onNext={onNext}
            onAbort={resetAndExit}
          />
        );
      case 'pinyin':
      case 'translation':
        return (
          <QuizCard
            key={card.id}
            card={card}
            mode={face}
            paused={paused}
            onNext={onNext}
            onAbort={resetAndExit}
          />
        );
      default:
        throw new Error('Unknown mixed face');
    }
  };

  const getWidget = (card: Card): ReactNode => {
    const mode = state === 'main' ? sessionModeRef.current : state;
    switch (mode) {
      case 'write':
        return renderFace(card, 'write');
      case 'prescription':
        return <PrescriptionPractice key={card.id} card={card} onNext={onNext} paused={paused} />;
      case 'pinyin':
      case 'translation':
        return (
          <QuizCard
            key={card.id}
            card={card}
            mode={mode}
            paused={paused}
            onNext={onNext}
            onAbort={resetAndExit}
          />
        );
      case 'mixed': {
        const face = cardFacesRef.current[card.id];
        if (!face) {
          throw new Error('Missing mixed face for card');
        }
        return renderFace(card, face);
      }
      default:
        throw new Error('Unknown state');
    }
  };

  return <div className='flex h-full w-full items-center justify-center px-3 py-3 sm:px-4 sm:py-4'>{current && getWidget(current)}</div>;
};
