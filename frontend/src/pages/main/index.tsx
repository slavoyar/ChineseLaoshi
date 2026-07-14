import { useGroupStore } from '@entities/group';
import { Groups } from '@widgets/groups';
import { StudyModes } from '@widgets/study-modes';
import { useEffect } from 'react';

export const Main = () => {
  const fetchGroups = useGroupStore((state) => state.fetch);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className='m-auto flex h-full flex-col gap-6 md:w-9/12 xl:w-7/12'>
      <StudyModes />
      <Groups className='min-h-0 flex-1' />
    </div>
  );
};
