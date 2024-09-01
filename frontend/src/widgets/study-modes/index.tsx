import { WriteStudy } from '@features/write-study';

export const StudyModes = () => (
  <div className='flex flex-col gap-2'>
    <h1 className='text-white text-xl text-center'>Study modes</h1>
    <div className='w-full justify-center flex'>
      <WriteStudy />
    </div>
  </div>
);
