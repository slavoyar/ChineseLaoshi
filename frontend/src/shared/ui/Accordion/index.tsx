import { HTMLAttributes, Key, ReactNode, useState } from 'react';
import './styles.css';

interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  sections: T[];
  rowKey: (item: T) => Key;
  header: (item: T) => ReactNode;
  content: (item: T) => ReactNode;
  onDelete: (item: T) => void;
}

const Accordion = <T,>({ sections, rowKey, header, content, onDelete }: Props<T>) => {
  const [openedKeys, setOpenedKeys] = useState<Key[]>([]);

  const toggleSection = (section: T) => {
    const key = rowKey(section);
    const keys = openedKeys.includes(key)
      ? openedKeys.filter((item) => item !== key)
      : [...openedKeys, key];
    setOpenedKeys(keys);
  };

  const isOpened = (section: T) => openedKeys.includes(rowKey(section));
  return (
    <div className='accordion'>
      {sections.map((section, index) => (
        <div key={rowKey(section)} className='accordion-item'>
          <div className={`accordion-header ${isOpened(section) ? 'border-b' : ''}`}>
            <div
              className='flex gap-2 items-center cursor-pointer'
              onClick={() => toggleSection(section)}
            >
              {`${index + 1}.`} {header(section)}
              <i className={`fa ${isOpened(section) ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
            </div>
            <i
              className='fa fa-close text-error-600 cursor-pointer hover:bg-secondary-600 p-1 rounded'
              onClick={() => onDelete(section)}
            />
          </div>
          <div className={`accordion-content  ${isOpened(section) ? 'active' : ''}`}>
            {content(section)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
