import { Route } from '@shared/types';
import { forwardRef, HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

const APP_NAME = '中国老师';

export const Header = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const navigate = useNavigate();

  return (
    <div ref={ref} className='fixed h-[80px] w-full bg-secondary-900' {...props}>
      <div className='m-auto flex h-full items-center justify-between p-4 text-white md:w-9/12 xl:w-7/12'>
        <button
          type='button'
          className='cursor-pointer text-2xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
          onClick={() => navigate(Route.Root)}
        >
          {APP_NAME}
        </button>
      </div>
    </div>
  );
});
