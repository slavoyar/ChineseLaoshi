import { GroupDto } from '@chinese-laoshi/shared';
import { useGroupStore } from '@entities/group';
import { useDelete } from '@shared/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/ui';
import { Route } from '@shared/types';
import { useNavigate } from 'react-router-dom';

import { CreateGroupCard } from './create-group-card';
import { GroupCard } from './group-card';
import { tileGridClassName } from '@shared/ui/tile-grid';

export const GroupGrid = () => {
  const groups = useGroupStore((state) => state.groups);
  const deleteGroup = useGroupStore((state) => state.delete);
  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<GroupDto>();
  const navigate = useNavigate();

  const deleteHandler = async () => {
    closeDeleteDialog();
    await deleteGroup(deleteItem.id);
  };

  return (
    <>
      <div className={tileGridClassName}>
        <CreateGroupCard />
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onNavigate={() => navigate(`${Route.Groups}/${group.id}`)}
            onDelete={() => openDeleteDialog(group)}
          />
        ))}
      </div>
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
