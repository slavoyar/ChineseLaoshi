import { useCardStore } from '@entities/card';
import { PenWrite } from '@shared/icons/pen-write';
import { Route } from '@shared/types';
import { useNavigate } from 'react-router-dom';

export const WriteStudy = () => {
  const setIsStudy = useCardStore((state) => state.setIsStudy);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsStudy(true);
    navigate(Route.StudyWrite);
  };

  return (
    <div
      className='flex flex-col gap-2 items-start justify-center w-fit p-4 bg-secondary-900 rounded-xl hover:bg-secondary-800 cursor-pointer'
      onClick={() => handleClick()}
    >
      <PenWrite />
      <div className='text-white text-center w-full'>Handwriting</div>
    </div>
  );
};
