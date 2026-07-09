import { useGroupStore } from '@entities/group';
import { Groups } from '@widgets/groups';
import { StudyModes } from '@widgets/study-modes';
import { useEffect, useRef } from 'react';

const GAP = 24;
const DEFAULT_OFFSET = 200;

export const Main = () => {
  const studyModesRef = useRef<HTMLDivElement>(null);
  const fetchGroups = useGroupStore((state) => state.fetch);

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className='m-auto flex h-full flex-col gap-6 md:w-9/12 xl:w-7/12'>
      <StudyModes ref={studyModesRef} />
      <Groups
        style={{
          maxHeight: `calc(100% - ${(studyModesRef.current?.offsetHeight ?? DEFAULT_OFFSET) + GAP}px`,
        }}
      />
    </div>
  );
};
