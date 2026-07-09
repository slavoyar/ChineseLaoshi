import './styles.css';

import { cn } from '@shared/utils';
import { HTMLAttributes, Key, ReactNode, useState } from 'react';

interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  sections: T[];
  isActionsAvailable?: boolean;
  actions?: (item: T) => ReactNode;
  rowKey: (item: T) => Key;
  header: (item: T) => ReactNode;
  content: (item: T) => ReactNode;
  onDelete?: (item: T) => void;
  onOpen?: (item: T) => void;
}

export const Accordion = <T,>({
  sections,
  rowKey,
  header,
  content,
  onDelete,
  onOpen,
  actions,
  isActionsAvailable,
  ...props
}: Props<T>) => {
  const [openedKey, setOpenedKey] = useState<Key>();

  const toggleSection = (section: T) => {
    const key = rowKey(section);
    const isOpen = openedKey === key;
    if (!isOpen && onOpen) {
      onOpen(section);
    }
    setOpenedKey((prev) => (prev === key ? undefined : key));
  };

  const isOpened = (section: T) => openedKey === rowKey(section);

  const handleDelete = (section: T) => {
    if (onDelete) {
      onDelete(section);
    }
  };
  return (
    <div className='accordion' {...props}>
      {sections.map((section, index) => (
        <div key={rowKey(section)} className='accordion-item'>
          <div className={`accordion-header ${isOpened(section) ? 'border-b' : ''}`}>
            <button
              type='button'
              className='flex flex-1 cursor-pointer items-center gap-2 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
              onClick={() => toggleSection(section)}
              aria-expanded={isOpened(section)}
            >
              {`${index + 1}.`} {header(section)}
              <i
                className={`fa ${isOpened(section) ? 'fa-chevron-down' : 'fa-chevron-right'}`}
                aria-hidden='true'
              />
            </button>
            <div className={cn('flex items-center gap-2', isActionsAvailable ? '' : 'hidden')}>
              {actions && actions(section)}
              <button
                type='button'
                className='flex min-h-11 min-w-11 items-center justify-center rounded text-error-600 hover:bg-secondary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'
                onClick={() => handleDelete(section)}
                aria-label='Delete section'
              >
                <i className='fa fa-close' aria-hidden='true' />
              </button>
            </div>
          </div>
          <div className={`accordion-content ${isOpened(section) ? 'active' : ''}`}>{content(section)}</div>
        </div>
      ))}
    </div>
  );
};
