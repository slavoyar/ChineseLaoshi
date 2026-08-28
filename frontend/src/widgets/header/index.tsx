import { AuthDialog } from '@features/auth-dialog';
import { DemoGateDialog } from '@features/demo-gate-dialog';
import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const APP_NAME = '中国老师';

export const Header = () => {
  const navigate = useNavigate();
  const [user, isDemo, isTelegramApp, signOut, openAuthDialog] = useAuthStore((state) => [
    state.user,
    state.isDemo,
    state.isTelegramApp,
    state.signOut,
    state.openAuthDialog,
  ]);

  const onSignOut = async () => {
    await signOut();
    navigate(Route.Root);
  };

  return (
    <>
      <div className='h-[80px] w-full shrink-0 border-b bg-card'>
        <div
          className={cn(
            'm-auto flex h-full items-center p-4 md:w-9/12 xl:w-7/12',
            isTelegramApp ? 'justify-center' : 'justify-between',
          )}
        >
          <button
            type='button'
            className='shrink-0 cursor-pointer text-2xl font-bold text-foreground'
            onClick={() => navigate(Route.Root)}
          >
            {APP_NAME}
          </button>

          {!isTelegramApp && (
            <div className='flex min-w-0 shrink items-center gap-2 sm:gap-3'>
              <div className='flex min-w-0 items-center gap-2 text-foreground'>
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=''
                    className='h-8 w-8 shrink-0 rounded-full object-cover'
                  />
                ) : (
                  <span className='shrink-0 rounded-full bg-primary p-2 text-primary-foreground'>
                    <User className='h-4 w-4' aria-hidden='true' />
                  </span>
                )}
                <div className='min-w-0 max-w-[7rem] truncate text-sm font-medium sm:max-w-[10rem]'>
                  {user?.name ?? 'Demo'}
                </div>
              </div>

              {isDemo ? (
                <Button type='button' size='sm' className='shrink-0' onClick={openAuthDialog}>
                  Sign up
                </Button>
              ) : (
                <button
                  type='button'
                  className='rounded p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                  aria-label='Sign out'
                  onClick={onSignOut}
                >
                  <LogOut className='h-4 w-4' />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {!isTelegramApp && <AuthDialog />}
      {!isTelegramApp && <DemoGateDialog />}
    </>
  );
};
