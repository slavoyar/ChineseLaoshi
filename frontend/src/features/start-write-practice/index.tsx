import { CARDS_PER_SESSION, StudyMode } from '@shared/config';
import { PenWrite } from '@shared/icons';
import { useStateStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { BookOpen, type LucideIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';

interface StudyModeButtonProps {
  mode: StudyMode;
  groupId?: string;
  disabled?: boolean;
}

type ModeIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const modeConfig: Record<StudyMode, { label: string; icon: ModeIcon; iconWrapClass: string }> = {
  write: {
    label: 'Handwriting',
    icon: PenWrite,
    iconWrapClass: 'bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]',
  },
  prescription: {
    label: 'Prescription',
    icon: BookOpen,
    iconWrapClass: 'bg-[hsl(var(--chart-1)/0.12)] text-[hsl(var(--chart-1))]',
  },
};

export const StudyModeButton = ({ mode, groupId, disabled = false }: StudyModeButtonProps) => {
  const setState = useStateStore((state) => state.setState);
  const navigate = useNavigate();
  const { label, icon: Icon, iconWrapClass } = modeConfig[mode];

  const handleStart = () => {
    setState(mode);
    const group = groupId ? `/${groupId}` : '';
    navigate(`${Route.WritePractice}/${CARDS_PER_SESSION}${group}`);
  };

  return (
    <Button
      variant='outline'
      disabled={disabled}
      className='flex h-auto min-w-[7.5rem] flex-col items-center gap-3 rounded-xl p-4 [&_svg]:size-6'
      onClick={handleStart}
    >
      <span className={cn('flex size-11 items-center justify-center rounded-lg', iconWrapClass)}>
        <Icon />
      </span>
      <span className='text-sm font-medium'>{label}</span>
    </Button>
  );
};

interface StudyModeControlsProps {
  groupId?: string;
  disabled?: boolean;
  className?: string;
}

export const StudyModeControls = ({ groupId, disabled, className }: StudyModeControlsProps) => (
  <div className={cn('flex w-full flex-wrap justify-center gap-3', className)}>
    <StudyModeButton mode='write' groupId={groupId} disabled={disabled} />
    <StudyModeButton mode='prescription' groupId={groupId} disabled={disabled} />
  </div>
);
