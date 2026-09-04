import { RouteFallback } from '@app/route-fallback';
import { Header } from '@widgets/header';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

export const HeaderLayout = () => {
  const { t } = useTranslation();

  return (
    <div
      className='flex h-dvh min-h-0 w-full flex-col overflow-hidden'
      style={{
        paddingTop: 'var(--tg-content-safe-top, var(--tg-safe-top, 0px))',
        paddingBottom: 'var(--tg-content-safe-bottom, var(--tg-safe-bottom, 0px))',
      }}
    >
      <Header />
      <main className='min-h-0 flex-1 overflow-hidden p-2 md:px-5'>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className='flex min-h-9 shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t bg-card px-4 py-1.5 text-xs text-muted-foreground'>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <span aria-hidden='true'>·</span>
        <span className='hidden text-center sm:inline'>{t('footer.tagline')}</span>
        <span className='hidden sm:inline' aria-hidden='true'>
          ·
        </span>
        <a href='/about' className='underline-offset-4 hover:text-foreground hover:underline'>
          {t('common.about')}
        </a>
      </footer>
    </div>
  );
};
