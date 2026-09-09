import { useAuthStore } from '@shared/stores';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui';
import { useTranslation } from 'react-i18next';

export const DemoGateDialog = () => {
  const { t } = useTranslation();
  const [isOpen, closeDemoGate, openAuthFromDemoGate] = useAuthStore((state) => [
    state.isDemoGateOpen,
    state.closeDemoGate,
    state.openAuthFromDemoGate,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDemoGate()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('auth.demoGateTitle')}</DialogTitle>
          <DialogDescription>{t('auth.demoGateDescription')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={closeDemoGate}>
            {t('common.cancel')}
          </Button>
          <Button type='button' onClick={openAuthFromDemoGate}>
            {t('common.signUp')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
