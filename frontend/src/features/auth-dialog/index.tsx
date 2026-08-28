import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { messageForApiError, parseApiError } from '@shared/api';
import { isDarkTheme, subscribeThemeChange } from '@shared/lib/theme';
import { useAuthStore } from '@shared/stores';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui';
import { cn } from '@shared/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AuthDialog = () => {
  const { t } = useTranslation();
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
      setError(t('auth.googleCredentialError'));
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
          <DialogTitle>{t('auth.signUpTitle')}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3 pt-2'>
          <div className={cn('flex w-full justify-center', isSubmitting && 'pointer-events-none opacity-60')}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setError(t('auth.googleSignInError'))}
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
