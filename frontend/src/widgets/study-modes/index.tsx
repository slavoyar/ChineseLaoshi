import { WriteStudy } from '@features/write-study';
import { forwardRef } from 'react';

export const StudyModes = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className='flex flex-col gap-2'>
    <h1 className='text-white text-xl text-center'>Study modes</h1>
    <div className='w-full justify-center flex'>
      <WriteStudy />
    </div>
  </div>
));
