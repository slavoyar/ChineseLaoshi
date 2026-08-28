import { CARDS_PER_SESSION, StudyMode } from '@shared/config';
import { PenWrite } from '@shared/icons';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { BookOpen, Languages, type LucideIcon, Shuffle, TextQuote } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface StudyModeButtonProps {
  mode: StudyMode;
  groupId?: string;
  disabled?: boolean;
}

type ModeIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const STUDY_MODE_ORDER: StudyMode[] = ['write', 'prescription', 'mixed', 'pinyin', 'translation'];

const modeConfig: Record<StudyMode, { labelKey: string; icon: ModeIcon; iconWrapClass: string }> = {
  write: {
    labelKey: 'studyModes.handwriting',
    icon: PenWrite,
    iconWrapClass: 'bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]',
  },
  prescription: {
    labelKey: 'studyModes.strokeOrder',
    icon: BookOpen,
    iconWrapClass: 'bg-[hsl(var(--chart-1)/0.12)] text-[hsl(var(--chart-1))]',
  },
  pinyin: {
    labelKey: 'studyModes.pinyin',
    icon: Languages,
    iconWrapClass: 'bg-[hsl(var(--chart-3)/0.12)] text-[hsl(var(--chart-3))]',
  },
  translation: {
    labelKey: 'studyModes.translation',
    icon: TextQuote,
    iconWrapClass: 'bg-[hsl(var(--chart-4)/0.12)] text-[hsl(var(--chart-4))]',
  },
  mixed: {
    labelKey: 'studyModes.mixed',
    icon: Shuffle,
    iconWrapClass: 'bg-[hsl(var(--chart-5)/0.12)] text-[hsl(var(--chart-5))]',
  },
};

const mobileGridPlacement: Record<StudyMode, string> = {
  write: 'max-md:col-start-1 max-md:row-start-1',
  mixed: 'max-md:col-start-2 max-md:row-span-2 max-md:row-start-1',
  prescription: 'max-md:col-start-3 max-md:row-start-1',
  pinyin: 'max-md:col-start-1 max-md:row-start-2',
  translation: 'max-md:col-start-3 max-md:row-start-2',
};

export const StudyModeButton = ({ mode, groupId, disabled = false }: StudyModeButtonProps) => {
  const { t } = useTranslation();
  const setState = useStateStore((state) => state.setState);
  const navigate = useNavigate();
  const { labelKey, icon: Icon, iconWrapClass } = modeConfig[mode];
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
        'flex h-auto w-full min-w-0 flex-col items-center gap-1.5 rounded-lg p-2 sm:gap-2 sm:rounded-xl sm:p-3 md:gap-3 md:p-4',
        mobileGridPlacement[mode],
        isMixed &&
          'max-md:h-full max-md:justify-center max-md:gap-2 max-md:border-[hsl(var(--chart-5)/0.4)] max-md:bg-[hsl(var(--chart-5)/0.05)] md:col-start-3 md:row-span-1 md:row-start-1 md:h-auto md:bg-transparent',
        isMixed
          ? '[&_svg]:size-5 sm:[&_svg]:size-5 md:[&_svg]:size-6'
          : '[&_svg]:size-[1.125rem] sm:[&_svg]:size-5 md:[&_svg]:size-6'
      )}
      onClick={handleStart}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md sm:size-9 md:size-11 md:rounded-lg',
          isMixed && 'max-md:size-10',
          iconWrapClass
        )}
      >
        <Icon />
      </span>
      <span className='max-w-full truncate text-center text-[11px] font-medium leading-tight sm:text-xs md:text-sm'>
        {t(labelKey)}
      </span>
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
      'grid w-full grid-cols-3 grid-rows-2 gap-1.5 max-md:items-stretch sm:gap-2 md:mx-auto md:max-w-3xl md:grid-cols-5 md:grid-rows-1 md:items-start md:gap-3',
      className
    )}
  >
    {STUDY_MODE_ORDER.map((mode) => (
      <StudyModeButton key={mode} mode={mode} groupId={groupId} disabled={disabled} />
    ))}
  </div>
);
