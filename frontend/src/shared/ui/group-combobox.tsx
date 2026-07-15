import { Group } from '@shared/api/generated';
import { Button } from '@shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover';
import { cn } from '@shared/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  groups: Group[];
  value?: string;
  onSelect: (group: Group) => void;
  placeholder?: string;
}

export const GroupCombobox = ({ groups, value, onSelect, placeholder = 'Select group…' }: Props) => {
  const [open, setOpen] = useState(false);
  const selected = groups.find((group) => group.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
          {selected ? selected.name : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command>
          <CommandInput placeholder='Search groups…' />
          <CommandList>
            <CommandEmpty>No group found.</CommandEmpty>
            <CommandGroup>
              {groups.map((group) => (
                <CommandItem
                  key={group.id}
                  value={group.name}
                  onSelect={() => {
                    onSelect(group);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === group.id ? 'opacity-100' : 'opacity-0')} />
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
