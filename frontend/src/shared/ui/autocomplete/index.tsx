import { ChangeEvent, HTMLAttributes, useState } from 'react';

interface Props<T> extends Omit<HTMLAttributes<HTMLInputElement>, 'onSelect'> {
  items: T[];
  onSelect: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  filterableValue?: (item: T) => string;
}

export const Autocomplete = <T extends unknown>({
  items,
  onSelect,
  renderItem,
  filterableValue = (item) => {
    if ((item as { value: string }).value) {
      return (item as { value: string }).value;
    }
    throw new Error('You should specify the value to filter items.');
  },
  ...props
}: Props<T>) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    setFilteredItems(
      items.filter((item) => filterableValue(item).toLowerCase().includes(inputValue.toLowerCase()))
    );
  };

  return (
    <div className='autocomplete'>
      <input
        type='text'
        value={query}
        onChange={handleInputChange}
        className='autocomplete-input'
        {...props}
      />
      {filteredItems.length > 0 && (
        <ul className='autocomplete-list'>
          {filteredItems.map((item) => (
            <li
              key={filterableValue(item)}
              className='autocomplete-item'
              onClick={() => onSelect(item)}
            >
              {renderItem ? renderItem(item) : filterableValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
