import { ChangeEvent, useEffect, useState } from 'react';
import { TextField, TextFieldProps } from '../text-field';

interface Props<T> extends Omit<TextFieldProps, 'onSelect'> {
  items: T[];
  onSelect: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  filterableValue: (item: T) => string;
  keyValue: (item: T) => string;
}

export const Autocomplete = <T extends unknown>({
  items,
  onSelect,
  renderItem,
  filterableValue,
  keyValue,
  ...props
}: Props<T>) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

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

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  return (
    <div className='relative'>
      <TextField
        type='text'
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => handleBlur}
        {...props}
      />
      {filteredItems.length > 0 && isFocused && (
        <ul className='w-full absolute max-h-[200px] bg-secondary-600 rounded p-2'>
          {filteredItems.map((item) => (
            <li
              key={keyValue(item)}
              className='text-white hover:bg-secondary-500 cursor-pointer rounded p-2'
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
