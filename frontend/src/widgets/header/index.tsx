import { AuthDialog } from '@features/auth-dialog';
import { DemoGateDialog } from '@features/demo-gate-dialog';
import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button } from '@shared/ui';
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
        <div className='m-auto flex h-full items-center justify-between p-4 md:w-9/12 xl:w-7/12'>
          <button
            type='button'
            className='cursor-pointer text-2xl font-bold text-foreground'
            onClick={() => navigate(Route.Root)}
          >
            {APP_NAME}
          </button>

          <div className='flex items-center gap-3'>
            {!isTelegramApp && (
              <>
                <div className='flex items-center gap-2 text-foreground'>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt='' className='h-8 w-8 rounded-full object-cover' />
                  ) : (
                    <span className='rounded-full bg-primary p-2 text-primary-foreground'>
                      <User className='h-4 w-4' aria-hidden='true' />
                    </span>
                  )}
                  <div className='text-sm font-medium'>{user?.name ?? 'Demo'}</div>
                </div>

                {isDemo ? (
                  <Button type='button' size='sm' onClick={openAuthDialog}>
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
              </>
            )}
          </div>
        </div>
      </div>
      {!isTelegramApp && <AuthDialog />}
      {!isTelegramApp && <DemoGateDialog />}
    </>
  );
};
