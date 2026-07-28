import { StudyModeControls } from '@features/start-write-practice';
import { cn } from '@shared/utils';

interface Props {
  groupId?: string;
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const StudyModes = ({ groupId, disabled, showLabel = true, className }: Props) => (
  <div className={cn('flex flex-col gap-2', className)}>
    {showLabel && <h1 className='text-center text-xl text-foreground'>Study modes</h1>}
    <StudyModeControls groupId={groupId} disabled={disabled} />
  </div>
);
