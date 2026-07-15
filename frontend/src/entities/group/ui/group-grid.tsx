import { useGroupStore } from '@entities/group';
import { Group } from '@shared/api/generated';
import { useDelete } from '@shared/hooks';
import { Route } from '@shared/types';
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
import { tileGridClassName } from '@shared/ui/tile-grid';
import { useNavigate } from 'react-router-dom';

import { CreateGroupCard } from './create-group-card';
import { GroupCard } from './group-card';

export const GroupGrid = () => {
  const groups = useGroupStore((state) => state.groups);
  const deleteGroup = useGroupStore((state) => state.delete);
  const { isDeleteDialogOpen, closeDeleteDialog, deleteItem, openDeleteDialog } = useDelete<Group>();
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
