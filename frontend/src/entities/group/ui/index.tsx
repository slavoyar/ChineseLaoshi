import { GroupDto } from '@chinese-laoshi/shared';
import { useGroupStore } from '@entities/group';
import { useDelete } from '@shared/hooks';
import { Accordion, DeleteDialog } from '@shared/ui';
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
    await deleteGroup(deleteItem.id);
  };

  return (
    <>
      <Accordion
        sections={groups}
        rowKey={(item) => item.id}
        header={(item) => <GroupHeader name={item.name} wordCount={item.wordCount} />}
        content={content}
        onOpen={onGroupOpen}
        onDelete={openDeleteDialog}
      />
      <DeleteDialog
        title='Delete group'
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDelete={deleteHandler}
      >
        <div className='text-secondary-200'>Are you sure you want to delete group '{deleteItem.name}'?</div>
      </DeleteDialog>
    </>
  );
};
