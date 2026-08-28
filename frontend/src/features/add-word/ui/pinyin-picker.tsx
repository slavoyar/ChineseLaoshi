import type { PinyinChar } from '@shared/api';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui';
import { cn } from '@shared/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

type PinyinPickerProps = {
  characters: PinyinChar[];
  selectedReadings: string[];
  onSelectReading: (index: number, reading: string) => void;
};

export const PinyinPicker = ({ characters, selectedReadings, onSelectReading }: PinyinPickerProps) => {
  if (characters.length === 0) {
    return null;
  }

  return (
    <div
      className='grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] gap-x-2 gap-y-3'
      role='group'
      aria-label='Pinyin readings by character'
    >
      {characters.map((item, index) => {
        const selected = selectedReadings[index] ?? item.readings[0] ?? '';
        const hasAlternates = item.readings.length > 1;

        return (
          <PinyinCell
            key={`${item.char}-${index}`}
            char={item.char}
            readings={item.readings}
            selected={selected}
            hasAlternates={hasAlternates}
            onSelect={(reading) => onSelectReading(index, reading)}
          />
        );
      })}
    </div>
  );
};

type PinyinCellProps = {
  char: string;
  readings: string[];
  selected: string;
  hasAlternates: boolean;
  onSelect: (reading: string) => void;
};

const ReadingChip = ({ selected, hasAlternates }: { selected: string; hasAlternates: boolean }) => (
  <span
    className={cn(
      'grid h-9 w-full grid-cols-[1rem_minmax(0,1fr)_1rem] items-center rounded-md px-1 text-xs leading-tight',
      hasAlternates
        ? 'bg-secondary text-secondary-foreground hover:bg-accent'
        : 'bg-secondary/80 text-secondary-foreground'
    )}
  >
    <span aria-hidden className='size-3.5' />
    <span className='truncate text-center'>{selected}</span>
    <span className='flex items-center justify-end' aria-hidden>
      {hasAlternates ? <ChevronDown className='size-3.5 opacity-70' /> : null}
    </span>
  </span>
);

const PinyinCell = ({ char, readings, selected, hasAlternates, onSelect }: PinyinCellProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex min-w-0 flex-col items-stretch gap-1.5'>
      <span className='flex h-8 items-center justify-center text-2xl leading-none' lang='zh'>
        {char}
      </span>
      {hasAlternates ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type='button'
              className='w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              aria-label={`Choose reading for ${char}`}
            >
              <ReadingChip selected={selected} hasAlternates />
            </button>
          </PopoverTrigger>
          <PopoverContent className='w-auto min-w-[7rem] p-1' align='center' sideOffset={6}>
            <div className='flex flex-col gap-0.5' role='listbox' aria-label={`Readings for ${char}`}>
              {readings.map((reading) => {
                const isSelected = reading === selected;
                return (
                  <button
                    key={reading}
                    type='button'
                    role='option'
                    aria-selected={isSelected}
                    className={cn(
                      'min-h-9 rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={() => {
                      onSelect(reading);
                      setOpen(false);
                    }}
                  >
                    {reading}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className='w-full' aria-label={`Reading for ${char}`}>
          <ReadingChip selected={selected} hasAlternates={false} />
        </div>
      )}
    </div>
  );
};
