import { StudyModeControls } from '@features/start-write-practice';
import { testIds } from '@shared/config';
import { cn } from '@shared/utils';
import { useTranslation } from 'react-i18next';

interface Props {
  groupId?: string;
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const StudyModes = ({ groupId, disabled, showLabel = true, className }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col gap-1.5 sm:gap-2', className)} data-tour='study-modes'>
      {showLabel && (
        <h1
          className='text-center text-lg font-semibold text-foreground sm:text-xl'
          data-testid={testIds.studyModes.heading}
        >
          {t('studyModes.title')}
        </h1>
      )}
      <StudyModeControls groupId={groupId} disabled={disabled} />
    </div>
  );
};
