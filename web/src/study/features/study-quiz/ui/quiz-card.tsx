import { cardService } from '@entities/card';
import { Card, isRequestCanceled, parseApiError, Word } from '@shared/api';
import { testIds } from '@shared/config';
import { useAuthStore } from '@shared/stores';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type QuizMode = 'pinyin' | 'translation';

interface Props {
  card: Card;
  mode: QuizMode;
  paused?: boolean;
  initialDistractors?: Word[];
  onNext: () => void;
  onAbort?: () => void;
}

interface QuizOption {
  id: string;
  label: string;
}

const answerForMode = (word: Word, mode: QuizMode): string =>
  mode === 'pinyin' ? word.transcription : word.translation;

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildOptions = (card: Card, distractors: Word[], mode: QuizMode): QuizOption[] => {
  const correctLabel = answerForMode(card.word, mode);
  const seen = new Set<string>([correctLabel.toLowerCase()]);
  const options: QuizOption[] = [{ id: card.word.id, label: correctLabel }];

  for (const word of distractors) {
    const label = answerForMode(word, mode);
    const key = label.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    options.push({ id: word.id, label });
    if (options.length >= 4) {
      break;
    }
  }

  return shuffle(options);
};

export const QuizCard = ({ card, mode, paused = false, initialDistractors, onNext, onAbort }: Props) => {
  const { t } = useTranslation();
  const isDemo = useAuthStore((state) => state.isDemo);

  const [options, setOptions] = useState<QuizOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);
  const hasMultipleChoicesRef = useRef(false);

  const correctOptionId = useMemo(() => card.word.id, [card.word.id]);

  useEffect(() => {
    let active = true;
    setSelectedId(null);

    const applyDistractors = (distractors: Word[]) => {
      if (!active) {
        return;
      }
      const built = buildOptions(card, distractors, mode);
      hasMultipleChoicesRef.current = built.length >= 2;
      setOptions(built);
      setLoading(false);
    };

    if (initialDistractors !== undefined) {
      applyDistractors(initialDistractors);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    cardService
      .getQuizDistractors(card.id)
      .then((distractors) => {
        applyDistractors(distractors);
      })
      .catch(() => {
        applyDistractors([]);
      });

    return () => {
      active = false;
    };
  }, [card, mode, initialDistractors]);

  const advance = async (guessed: boolean) => {
    if (isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;

    const cardId = card.id;
    onNext();

    try {
      if (!isDemo && hasMultipleChoicesRef.current) {
        await cardService.updateCardStats(cardId, guessed);
      }
    } catch (err) {
      if (isRequestCanceled(err)) {
        return;
      }
      if (parseApiError(err).code === 'unauthorizedError') {
        return;
      }
      onAbort?.();
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const onSelect = (optionId: string) => {
    if (selectedId || loading || paused) {
      return;
    }
    setSelectedId(optionId);
    const guessed = optionId === correctOptionId;
    window.setTimeout(() => {
      void advance(guessed);
    }, 700);
  };

  const promptLabel = mode === 'pinyin' ? t('quiz.pickPinyin') : t('quiz.pickTranslation');

  return (
    <div className='flex w-full max-w-md flex-col gap-3 rounded-2xl border bg-card p-3 sm:gap-4 sm:p-4 md:w-[500px]'>
      <p className='text-center text-xs text-muted-foreground sm:text-sm' data-testid={testIds.quiz.prompt}>
        {promptLabel}
      </p>
      <div className='rounded-md bg-muted py-8 text-center text-6xl font-medium tracking-wide sm:py-12 sm:text-7xl'>
        {card.word.symbols}
      </div>
      <div
        className={cn('grid gap-2', options.length <= 2 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}
        aria-busy={loading}
        data-testid={testIds.quiz.choices}
      >
        {loading ? (
          <p className='col-span-full text-center text-sm text-muted-foreground'>
            {t('quiz.loadingChoices')}
          </p>
        ) : (
          options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrect = option.id === correctOptionId;
            const showResult = selectedId !== null;

            return (
              <Button
                key={option.id}
                type='button'
                variant='outline'
                data-testid={testIds.quiz.choice}
                disabled={selectedId !== null || paused}
                className={cn(
                  'h-auto min-h-11 whitespace-normal px-3 py-2 text-left text-sm',
                  showResult && isCorrect && 'border-green-500 bg-green-500/10',
                  showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10'
                )}
                onClick={() => onSelect(option.id)}
              >
                {option.label}
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
};
