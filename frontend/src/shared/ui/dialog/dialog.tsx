import './styles.css';
import { FC } from 'react';
import { DialogProps } from './types';

export const Dialog: FC<DialogProps> = ({ isOpen, onClose, title, footer, children, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className='dialog-overlay'>
      <div {...props} className={`dialog ${props.className}`}>
        <div className='dialog-header'>
          <h2>{title}</h2>
          <i
            className='fa fa-close hover:bg-secondary-600 p-1 rounded cursor-pointer'
            onClick={onClose}
          />
        </div>
        <div className='dialog-body'>{children}</div>
        <div className='dialog-footer'>{footer}</div>
      </div>
    </div>
  );
};
