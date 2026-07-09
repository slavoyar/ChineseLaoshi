import { useClickOutside } from '@siberiacancode/reactuse';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);

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
  }, [value, items]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) => filterableValue(item).toLowerCase().includes(query.toLowerCase()))
    );
    setHighlightedIndex(0);
  }, [query, items]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  const onItemSelect = (item: T) => {
    setQuery(filterableValue(item));
    setIsFocused(false);
    onSelect(item);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || filteredItems.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((index) => (index + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((index) => (index - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onItemSelect(filteredItems[highlightedIndex]);
    }
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
        onKeyDown={handleKeyDown}
        {...props}
      />
      {filteredItems.length > 0 && isFocused && (
        <ul
          ref={listRef}
          className='absolute z-[1000] max-h-[200px] w-full overflow-auto rounded bg-secondary-600 p-2'
          role='listbox'
        >
          {filteredItems.map((item, index) => (
            <li key={keyValue(item)} role='presentation'>
              <button
                type='button'
                className={`w-full cursor-pointer rounded p-2 text-left text-white hover:bg-secondary-500 ${
                  index === highlightedIndex ? 'bg-secondary-500' : ''
                }`}
                onClick={() => onItemSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {renderItem ? renderItem(item) : filterableValue(item)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
