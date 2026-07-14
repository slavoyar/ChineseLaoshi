import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { forwardRef, HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

const APP_NAME = '中国老师';

export const Header = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const navigate = useNavigate();
  const [username, isDemo, signOut] = useAuthStore((state) => [state.username, state.isDemo, state.signOut]);

  const onSignOut = () => {
    signOut();
    navigate(Route.Root);
  };

  return (
    <div ref={ref} className='fixed h-[80px] w-full bg-secondary-900' {...props}>
      <div className='m-auto flex h-full items-center justify-between p-4 text-white md:w-9/12 xl:w-7/12'>
        <button
          type='button'
          className='cursor-pointer text-2xl font-bold'
          onClick={() => navigate(Route.Root)}
        >
          {APP_NAME}
        </button>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-white'>
            <i className='fa fa-user rounded-full bg-primary-200 p-2' aria-hidden='true' />
            <div>{username}</div>
            {isDemo && <span className='text-sm text-secondary-200'>(mock data)</span>}
          </div>
          {!isDemo && (
            <button
              type='button'
              className='fa fa-sign-out cursor-pointer'
              aria-label='Sign out'
              onClick={onSignOut}
            />
          )}
        </div>
      </div>
    </div>
  );
});
