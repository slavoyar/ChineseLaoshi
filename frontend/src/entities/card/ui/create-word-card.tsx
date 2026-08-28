import { testIds } from '@shared/config';
import { useRequireAuth } from '@shared/hooks';
import { tileItemClassName } from '@shared/ui';
import { cn } from '@shared/utils';
import { Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  renderDialog: (p: { open: boolean; onOpenChange: (open: boolean) => void }) => ReactNode;
}

export const CreateWordCard = ({ renderDialog }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { gateAction } = useRequireAuth();

  const handleClick = () => {
    gateAction(() => setIsOpen(true));
  };

  return (
    <>
      <div className={cn('relative pb-2', tileItemClassName)}>
        <button
          type='button'
          aria-label={t('words.addWordAria')}
          data-testid={testIds.word.addTrigger}
          className='flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={handleClick}
        >
          <Plus className='h-6 w-6' aria-hidden='true' />
          <span className='text-[10px] font-medium'>{t('words.addWord')}</span>
        </button>
      </div>
      {renderDialog({ open: isOpen, onOpenChange: setIsOpen })}
    </>
  );
};
