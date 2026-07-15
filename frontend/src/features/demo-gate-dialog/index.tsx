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

export const DemoGateDialog = () => {
  const [isOpen, closeDemoGate, openAuthFromDemoGate] = useAuthStore((state) => [
    state.isDemoGateOpen,
    state.closeDemoGate,
    state.openAuthFromDemoGate,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDemoGate()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Registration required</DialogTitle>
          <DialogDescription>
            Create a free account to add groups, words, and manage your vocabulary. Study modes are available
            in demo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={closeDemoGate}>
            Cancel
          </Button>
          <Button type='button' onClick={openAuthFromDemoGate}>
            Sign up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
