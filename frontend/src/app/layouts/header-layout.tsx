import { RouteFallback } from '@app/route-fallback';
import { Header } from '@widgets/header';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export const HeaderLayout = () => {
  return (
    <div className='flex h-dvh min-h-0 w-full flex-col overflow-hidden'>
      <Header />
      <main className='min-h-0 flex-1 overflow-hidden p-2 md:px-5'>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
