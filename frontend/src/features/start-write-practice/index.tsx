import { CARDS_PER_SESSION, StudyMode } from '@shared/config';
import { PenWrite } from '@shared/icons';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { BookOpen, Languages, Shuffle, TextQuote, type LucideIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';

interface StudyModeButtonProps {
  mode: StudyMode;
  groupId?: string;
  disabled?: boolean;
}

type ModeIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const STUDY_MODE_ORDER: StudyMode[] = ['write', 'prescription', 'mixed', 'pinyin', 'translation'];

const modeConfig: Record<StudyMode, { label: string; icon: ModeIcon; iconWrapClass: string }> = {
  write: {
    label: 'Handwriting',
    icon: PenWrite,
    iconWrapClass: 'bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]',
  },
  prescription: {
    label: 'Stroke order',
    icon: BookOpen,
    iconWrapClass: 'bg-[hsl(var(--chart-1)/0.12)] text-[hsl(var(--chart-1))]',
  },
  pinyin: {
    label: 'Pinyin',
    icon: Languages,
    iconWrapClass: 'bg-[hsl(var(--chart-3)/0.12)] text-[hsl(var(--chart-3))]',
  },
  translation: {
    label: 'Translation',
    icon: TextQuote,
    iconWrapClass: 'bg-[hsl(var(--chart-4)/0.12)] text-[hsl(var(--chart-4))]',
  },
  mixed: {
    label: 'Mixed',
    icon: Shuffle,
    iconWrapClass: 'bg-[hsl(var(--chart-5)/0.12)] text-[hsl(var(--chart-5))]',
  },
};

export const StudyModeButton = ({ mode, groupId, disabled = false }: StudyModeButtonProps) => {
  const setState = useStateStore((state) => state.setState);
  const navigate = useNavigate();
  const { label, icon: Icon, iconWrapClass } = modeConfig[mode];
  const isMixed = mode === 'mixed';

  const handleStart = () => {
    setState(mode);
    const group = groupId ? `/${groupId}` : '';
    navigate(`${Route.WritePractice}/${CARDS_PER_SESSION}${group}`);
  };

  return (
    <Button
      variant='outline'
      disabled={disabled}
      className={cn(
        'flex h-auto w-full flex-col items-center gap-2 rounded-lg p-2.5 sm:gap-3 sm:rounded-xl sm:p-3.5 md:min-w-0 md:p-4',
        'max-md:flex-row max-md:justify-center max-md:gap-2 max-md:px-2.5 max-md:py-2',
        isMixed &&
          'max-md:col-span-2 max-md:mx-auto max-md:max-w-[11.5rem] md:col-start-3 md:row-start-1',
        '[&_svg]:size-5 sm:[&_svg]:size-6'
      )}
      onClick={handleStart}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md sm:size-10 md:size-11 md:rounded-lg',
          iconWrapClass
        )}
      >
        <Icon />
      </span>
      <span className='text-xs font-medium leading-tight sm:text-sm'>{label}</span>
    </Button>
  );
};

interface StudyModeControlsProps {
  groupId?: string;
  disabled?: boolean;
  className?: string;
}

export const StudyModeControls = ({ groupId, disabled, className }: StudyModeControlsProps) => (
  <div
    className={cn(
      'grid w-full max-w-xl grid-cols-2 gap-2 sm:max-w-none sm:gap-2.5 md:mx-auto md:max-w-3xl md:grid-cols-5 md:gap-3',
      className
    )}
  >
    {STUDY_MODE_ORDER.map((mode) => (
      <StudyModeButton key={mode} mode={mode} groupId={groupId} disabled={disabled} />
    ))}
  </div>
);
