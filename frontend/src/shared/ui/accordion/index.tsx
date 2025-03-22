import './styles.css';

import { HTMLAttributes, Key, ReactNode, useState } from 'react';

interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  sections: T[];
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
            <div className='flex cursor-pointer items-center gap-2' onClick={() => toggleSection(section)}>
              {`${index + 1}.`} {header(section)}
              <i className={`fa ${isOpened(section) ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
            </div>
            <div className='flex items-center gap-2'>
              {actions && actions(section)}
              <i
                className='fa fa-close text-error-600 hover:bg-secondary-600 cursor-pointer rounded p-1'
                onClick={() => handleDelete(section)}
              />
            </div>
          </div>
          <div className={`accordion-content ${isOpened(section) ? 'active' : ''}`}>{content(section)}</div>
        </div>
      ))}
    </div>
  );
};
