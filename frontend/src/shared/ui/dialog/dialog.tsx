import './styles.css';

import { cn } from '@shared/utils';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { DialogProps } from './types';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Dialog = ({ isOpen, onClose, title, footer, children, ...props }: DialogProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusableElements = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusableElements[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled')
      );
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <div className={cn('dialog-overlay', isOpen ? 'flex' : 'hidden')}>
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        {...props}
        className={cn('dialog', props.className ?? '')}
      >
        <div className='dialog-header'>
          <h2 id={titleId}>{title}</h2>
          <button
            type='button'
            className='flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded hover:bg-secondary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
            onClick={onClose}
            aria-label='Close dialog'
          >
            <i className='fa fa-close' aria-hidden='true' />
          </button>
        </div>
        <div className='dialog-body'>{children}</div>
        <div className='dialog-footer'>{footer}</div>
      </div>
    </div>,
    document.body
  );
};
