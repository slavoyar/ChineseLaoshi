import { useGroupStore } from '@entities/group';
import { Group } from '@shared/api';
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
  tileGridClassName,
} from '@shared/ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CreateGroupCard } from './create-group-card';
import { GroupCard } from './group-card';

interface Props {
  renderCreateDialog: (p: { open: boolean; onOpenChange: (open: boolean) => void }) => ReactNode;
  onPrefetchGroup?: (groupId: string) => void;
}

export const GroupGrid = ({ renderCreateDialog, onPrefetchGroup }: Props) => {
  const { t } = useTranslation();
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
        <CreateGroupCard renderDialog={renderCreateDialog} />
        {(groups ?? []).map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onNavigate={() => navigate(`${Route.Groups}/${group.id}`)}
            onDelete={() => openDeleteDialog(group)}
            onPrefetch={() => onPrefetchGroup?.(group.id)}
          />
        ))}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('groups.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('groups.deleteDescription', { name: deleteItem.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteHandler}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
