import { StartWritePractice } from '@features/start-write-practice';
import { forwardRef } from 'react';

export const StudyModes = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className='flex flex-col gap-2'>
    <h1 className='text-white text-xl text-center'>Study modes</h1>
    <div className='w-full justify-center flex'>
      <StartWritePractice />
    </div>
  </div>
));
