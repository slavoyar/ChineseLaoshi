import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { forwardRef, HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props extends HTMLAttributes<HTMLDivElement> {
  username: string;
}

const APP_NAME = '中国老师';

export const Header = forwardRef<HTMLDivElement, Props>(({ username, ...props }, ref) => {
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  const onSignOut = () => {
    navigate(Route.SignIn);
    signOut();
  };

  return (
    <div ref={ref} className='fixed h-[80px] w-full bg-secondary-900' {...props}>
      <div className='m-auto flex h-full items-center justify-between p-4 text-white md:w-9/12 xl:w-7/12'>
        <div className='cursor-pointer text-2xl font-bold' onClick={() => navigate(Route.Root)}>
          {APP_NAME}
        </div>

        <div className='flex items-center gap-4'>
          {/* TODO: Pass as userCard through children */}
          <div className='flex items-center gap-2 text-white'>
            <i className='fa fa-user rounded-full bg-primary-200 p-2' />
            <div>{username}</div>
          </div>
          <i className='fa fa-sign-out cursor-pointer' onClick={() => onSignOut()} />
        </div>
      </div>
    </div>
  );
});
