import './styles.css';

import { cn } from '@shared/utils';
import { createPortal } from 'react-dom';

import { DialogProps } from './types';

export const Dialog = ({ isOpen, onClose, title, footer, children, ...props }: DialogProps) => {
  return createPortal(
    <div className={cn('dialog-overlay', isOpen ? 'flex' : 'hidden')} onClick={onClose}>
      <div {...props} className={cn('dialog', props.className ?? '')}>
        <div className='dialog-header'>
          <h2>{title}</h2>
          <i className='fa fa-close hover:bg-secondary-600 cursor-pointer rounded p-1' onClick={onClose} />
        </div>
        <div className='dialog-body'>{children}</div>
        <div className='dialog-footer'>{footer}</div>
      </div>
    </div>,
    document.body
  );
};
