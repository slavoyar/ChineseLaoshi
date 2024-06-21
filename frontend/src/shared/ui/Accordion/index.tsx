import { HTMLAttributes, Key, ReactNode, useState } from 'react';
import './styles.css';

interface OptionalProps<T> {
  onDelete?: (item: T) => void;
}

interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'content'>, OptionalProps<T> {
  sections: T[];
  rowKey: (item: T) => Key;
  header: (item: T) => ReactNode;
  content: (item: T) => ReactNode;
}

const defaultProps: OptionalProps<unknown> = {
  onDelete: () => {},
};

const Accordion = <T,>({ sections, rowKey, header, content, onDelete, ...props }: Props<T>) => {
  const [openedKeys, setOpenedKeys] = useState<Key[]>([]);

  const toggleSection = (section: T) => {
    const key = rowKey(section);
    const keys = openedKeys.includes(key)
      ? openedKeys.filter((item) => item !== key)
      : [...openedKeys, key];
    setOpenedKeys(keys);
  };

  const isOpened = (section: T) => openedKeys.includes(rowKey(section));

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
            <div
              className='flex gap-2 items-center cursor-pointer'
              onClick={() => toggleSection(section)}
            >
              {`${index + 1}.`} {header(section)}
              <i className={`fa ${isOpened(section) ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
            </div>
            <i
              className='fa fa-close text-error-600 cursor-pointer hover:bg-secondary-600 p-1 rounded'
              onClick={() => handleDelete(section)}
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

Accordion.defaultProps = defaultProps;

export default Accordion;
