import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { messageForApiError, parseApiError } from '@shared/api';
import { isDarkTheme, subscribeThemeChange } from '@shared/lib/theme';
import { useAuthStore } from '@shared/stores';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui';
import { cn } from '@shared/utils';
import { useEffect, useState } from 'react';

export const AuthDialog = () => {
  const [isOpen, closeAuthDialog, signInWithGoogle] = useAuthStore((state) => [
    state.isAuthDialogOpen,
    state.closeAuthDialog,
    state.signInWithGoogle,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleTheme, setGoogleTheme] = useState<'outline' | 'filled_blue'>(() =>
    isDarkTheme() ? 'filled_blue' : 'outline'
  );

  useEffect(() => {
    const sync = () => setGoogleTheme(isDarkTheme() ? 'filled_blue' : 'outline');
    sync();
    return subscribeThemeChange(sync);
  }, []);

  const onGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Google did not return a credential. Try again.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle(response.credential);
    } catch (err) {
      setError(messageForApiError(parseApiError(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthDialog()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Sign up to continue</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3 pt-2'>
          <div className={cn('flex w-full justify-center', isSubmitting && 'pointer-events-none opacity-60')}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setError('Google sign-in was cancelled or failed.')}
              useOneTap={false}
              theme={googleTheme}
              size='large'
              width='320'
              text='continue_with'
            />
          </div>
          {error ? <p className='text-center text-sm text-destructive'>{error}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
