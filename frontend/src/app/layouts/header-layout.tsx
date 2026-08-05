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
      <footer className='flex h-9 shrink-0 items-center justify-center gap-3 border-t bg-card px-4 text-xs text-muted-foreground'>
        <span>© {new Date().getFullYear()} Chinese Laoshi</span>
        <span aria-hidden='true'>·</span>
        <a
          href='/about.html'
          className='underline-offset-4 hover:text-foreground hover:underline'
        >
          About
        </a>
      </footer>
    </div>
  );
};
