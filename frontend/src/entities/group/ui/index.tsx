import { GroupDto } from '@chinese-laoshi/shared';
import { useGroupStore } from '@entities/group';
import { useDelete } from '@shared/hooks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@shared/ui';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

import { GroupHeader } from './group-header';

interface Props {
  content: (item: GroupDto) => ReactNode;
  onGroupOpen: (item: GroupDto) => void;
}

export const GroupList = ({ content, onGroupOpen }: Props) => {
  const [groups, deleteGroup] = useGroupStore((state) => [state.groups, state.delete]);
  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<GroupDto>();

  const deleteHandler = async () => {
    closeDeleteDialog();
    await deleteGroup(deleteItem.id);
  };

  return (
    <>
      <Accordion
        type='single'
        collapsible
        onValueChange={(value) => {
          if (value) {
            const group = groups.find((item) => item.id === value);
            if (group) {
              onGroupOpen(group);
            }
          }
        }}
      >
        {groups.map((group, index) => (
          <AccordionItem key={group.id} value={group.id}>
            <div className='flex items-center justify-between gap-2'>
              <AccordionTrigger className='flex-1 hover:no-underline'>
                <span>
                  {index + 1}. <GroupHeader name={group.name} wordCount={group.wordCount} />
                </span>
              </AccordionTrigger>
              <Button
                variant='ghost'
                size='icon'
                className='shrink-0 text-destructive hover:text-destructive'
                onClick={() => openDeleteDialog(group)}
                aria-label={`Delete group ${group.name}`}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
            <AccordionContent>{content(group)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete group &apos;{deleteItem.name}&apos;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteHandler}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
