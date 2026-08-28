import { cardService, useCardStore, WriteCard } from '@entities/card';
import { QuizCard, QuizMode } from '@features/study-quiz';
import { Card, isRequestCanceled, Word } from '@shared/api';
import { MixedFace, StudyMode } from '@shared/config';
import {
  assignMixedFaces,
  clearStudySession,
  loadStudySession,
  saveStudySession,
} from '@shared/lib/study-session';
import { useStateStore, useStudyPauseStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
import { PrescriptionPractice } from '@widgets/prescription-practice';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type SessionPhase = 'active' | 'complete';

const resolveQuizMode = (mode: StudyMode, card: Card, faces: Record<string, MixedFace>): QuizMode | null => {
  if (mode === 'pinyin' || mode === 'translation') {
    return mode;
  }
  if (mode === 'mixed') {
    const face = faces[card.id];
    if (face === 'pinyin' || face === 'translation') {
      return face;
    }
  }
  return null;
};

export const WritePractice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { groupId, count } = useParams();
  const [current, setCurrent] = useState<Card | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('active');
  const [nextBatchLoading, setNextBatchLoading] = useState(false);
  const [distractorCache, setDistractorCache] = useState<Record<string, Word[]>>({});
  const sessionCardsRef = useRef<Card[]>([]);
  const cardFacesRef = useRef<Record<string, MixedFace>>({});
  const remainingRef = useRef<Card[]>([]);
  const sessionModeRef = useRef<'main' | StudyMode>('main');
  const nextBatchRef = useRef<Card[] | null>(null);
  const distractorPendingRef = useRef<Set<string>>(new Set());
  const paused = useStudyPauseStore((state) => state.paused);

  const reset = useCardStore((state) => state.reset);
  const [state, setState] = useStateStore((store) => [store.state, store.setState]);

  const activeMode = state === 'main' ? sessionModeRef.current : state;

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
    faces: Record<string, MixedFace>
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

  const prefetchQuizDistractors = useCallback(
    (card: Card) => {
      if (distractorCache[card.id] !== undefined || distractorPendingRef.current.has(card.id)) {
        return;
      }
      distractorPendingRef.current.add(card.id);
      cardService
        .getQuizDistractors(card.id)
        .then((words) => {
          setDistractorCache((prev) => ({ ...prev, [card.id]: words }));
        })
        .catch(() => {
          setDistractorCache((prev) => ({ ...prev, [card.id]: [] }));
        })
        .finally(() => {
          distractorPendingRef.current.delete(card.id);
        });
    },
    [distractorCache]
  );

  const prefetchForCard = useCallback(
    (card: Card | undefined) => {
      if (!card) {
        return;
      }
      const quizMode = resolveQuizMode(activeMode, card, cardFacesRef.current);
      if (quizMode) {
        prefetchQuizDistractors(card);
      }
    },
    [activeMode, prefetchQuizDistractors]
  );

  const startBatch = (data: Card[], mode: StudyMode) => {
    sessionCardsRef.current = data;
    if (mode === 'mixed') {
      cardFacesRef.current = assignMixedFaces(data);
    }
    sessionModeRef.current = mode;
    const [first, ...rest] = data;
    remainingRef.current = rest;
    setCurrentIndex(0);
    setCurrent(first);
    setSessionPhase('active');
    setDistractorCache({});
    distractorPendingRef.current.clear();
    persistSession(mode, data, 0, cardFacesRef.current);
    prefetchForCard(first);
    prefetchForCard(rest[0]);
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
    prefetchForCard(currentCard);
    prefetchForCard(rest[0]);
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
          toast.warn(t('session.notEnoughCards'));
          return;
        }
        startBatch(data, state);
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

  useEffect(() => {
    if (sessionPhase !== 'complete' || !count) {
      return;
    }

    let active = true;
    setNextBatchLoading(true);
    nextBatchRef.current = null;

    cardService
      .getCardsWritePractice(count, groupId)
      .then((data) => {
        if (active) {
          nextBatchRef.current = data;
        }
      })
      .catch(() => {
        if (active) {
          nextBatchRef.current = [];
        }
      })
      .finally(() => {
        if (active) {
          setNextBatchLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [sessionPhase, count, groupId]);

  const onNext = () => {
    const [next, ...rest] = remainingRef.current;
    remainingRef.current = rest;
    if (!next) {
      setSessionPhase('complete');
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrent(next);
    persistSession(state, sessionCardsRef.current, nextIndex, cardFacesRef.current);
    prefetchForCard(rest[0]);
  };

  const onContinue = () => {
    const data = nextBatchRef.current;
    if (!data || data.length === 0) {
      toast.warn(t('session.notEnoughCards'));
      resetAndExit();
      return;
    }
    const mode = state === 'main' ? sessionModeRef.current : state;
    startBatch(data, mode);
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
            initialDistractors={distractorCache[card.id]}
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
            initialDistractors={distractorCache[card.id]}
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

  if (sessionPhase === 'complete') {
    return (
      <div className='flex h-full w-full items-center justify-center px-3 py-3 sm:px-4 sm:py-4'>
        <div className='flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center'>
          <h2 className='text-xl font-semibold text-foreground'>{t('session.completeTitle')}</h2>
          <p className='text-sm text-muted-foreground'>{t('session.completeDescription', { count })}</p>
          <div className='flex w-full flex-col gap-2 sm:flex-row sm:justify-center'>
            <Button type='button' disabled={nextBatchLoading} onClick={onContinue}>
              {t('common.continue')}
            </Button>
            <Button type='button' variant='outline' onClick={resetAndExit}>
              {t('common.finish')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full items-center justify-center px-3 py-3 sm:px-4 sm:py-4'>
      {current && getWidget(current)}
    </div>
  );
};
