import { useGroupStore } from '@entities/group';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';
import { Groups } from '@widgets/groups';
import { StudyModes } from '@widgets/study-modes';

const GAP = 24;
const DEFAULT_OFFSET = 200;

export const Main = () => {
  const studyModesRef = useRef<HTMLDivElement>(null);
  const fetchGroups = useGroupStore((state) => state.fetch);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups().catch(() => {
      navigate(Route.SignIn);
    });
  }, []);

  return (
    <div className='md:w-6/12 m-auto h-full flex flex-col gap-6'>
      <StudyModes ref={studyModesRef} />
      <Groups
        style={{
          maxHeight: `calc(100% - ${(studyModesRef.current?.offsetHeight ?? DEFAULT_OFFSET) + GAP}px`,
        }}
      />
    </div>
  );
};
