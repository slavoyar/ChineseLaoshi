import { StartWritePractice } from '@features/start-write-practice';

export const StudyModes = () => (
  <div className='flex flex-col gap-2'>
    <h1 className='text-center text-xl text-white'>Study modes</h1>
    <div className='flex w-full justify-center'>
      <StartWritePractice />
    </div>
  </div>
);
