import { useState } from 'react';

export const useDelete = <T>() => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<T>({} as T);

  const openDeleteDialog = (item: T) => {
    setDeleteDialogOpen(true);
    setDeleteItem(item);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return {
    isDeleteDialogOpen,
    closeDeleteDialog,
    openDeleteDialog,
    deleteItem,
  };
};
