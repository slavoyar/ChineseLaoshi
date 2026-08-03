import type { PinyinChar } from '@shared/api';
import { cn } from '@shared/utils';

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
    <div className='overflow-x-auto'>
      <div className='flex min-w-min gap-3' role='group' aria-label='Pinyin readings by character'>
        {characters.map((item, index) => {
          const selected = selectedReadings[index] ?? item.readings[0] ?? '';
          const hasAlternates = item.readings.length > 1;

          return (
            <div
              key={`${item.char}-${index}`}
              className='flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-20'
            >
              <span className='text-2xl leading-none' lang='zh'>
                {item.char}
              </span>
              <div
                className='flex w-full flex-col gap-1'
                role={hasAlternates ? 'listbox' : undefined}
                aria-label={`Readings for ${item.char}`}
              >
                {item.readings.map((reading) => {
                  const isSelected = reading === selected;
                  return (
                    <button
                      key={reading}
                      type='button'
                      role={hasAlternates ? 'option' : undefined}
                      aria-selected={hasAlternates ? isSelected : undefined}
                      disabled={!hasAlternates}
                      className={cn(
                        'min-h-9 w-full rounded-md px-1 py-1.5 text-center text-xs leading-tight transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent',
                        !hasAlternates && 'cursor-default opacity-90'
                      )}
                      onClick={() => {
                        if (hasAlternates) {
                          onSelectReading(index, reading);
                        }
                      }}
                    >
                      {reading}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
