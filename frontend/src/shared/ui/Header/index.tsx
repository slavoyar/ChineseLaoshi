import { forwardRef, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  username: string;
}

const APP_NAME = '中国老师';

const Header = forwardRef<HTMLDivElement, Props>(({ username, ...props }, ref) => (
  <div ref={ref} className='w-full h-[80px] bg-secondary-900 fixed' {...props}>
    <div className='md:w-6/12 h-full m-auto flex justify-between items-center p-4 text-white'>
      <div className='text-2xl font-bold'>{APP_NAME}</div>

      <div className='flex gap-4 items-center'>
        {/* TODO: Pass as userCard through children */}
        <div className='text-white flex items-center gap-2'>
          <i className='fa fa-user bg-primary-200 p-2 rounded-full' />
          <div>{username}</div>
        </div>
        <i className='fa fa-sign-out cursor-pointer' />
      </div>
    </div>
  </div>
));

export default Header;
