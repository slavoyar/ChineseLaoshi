import { useClickOutside } from '@siberiacancode/reactuse';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { TextField, TextFieldProps } from '../text-field';

interface Props<T> extends Omit<TextFieldProps, 'onSelect'> {
  items: T[];
  value?: string;
  onSelect: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  filterableValue: (item: T) => string;
  keyValue: (item: T) => string;
}

export const Autocomplete = <T,>({
  value,
  items,
  onSelect,
  renderItem,
  filterableValue,
  keyValue,
  ...props
}: Props<T>) => {
  const listRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    if (!value) {
      setQuery('');
      return;
    }
    const foundItem = items.find((item) => keyValue(item) === value);
    if (!foundItem) {
      return;
    }
    setQuery(filterableValue(foundItem));
  }, [value]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) => filterableValue(item).toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  const onItemSelect = (item: T) => {
    setQuery(filterableValue(item));
    setIsFocused(false);
    onSelect(item);
  };

  useClickOutside(listRef, () => {
    setIsFocused(false);
  });

  return (
    <div className='relative'>
      <TextField
        type='text'
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        {...props}
      />
      {filteredItems.length > 0 && isFocused && (
        <ul
          ref={listRef}
          className='bg-secondary-600 absolute z-[1000] max-h-[200px] w-full overflow-auto rounded p-2'
        >
          {filteredItems.map((item) => (
            <li
              key={keyValue(item)}
              className='hover:bg-secondary-500 cursor-pointer rounded p-2 text-white'
              onClick={() => onItemSelect(item)}
            >
              {renderItem ? renderItem(item) : filterableValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
