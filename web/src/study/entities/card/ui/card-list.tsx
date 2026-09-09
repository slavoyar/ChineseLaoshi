import { ReactNode } from 'react';

import { WordGrid } from './word-grid';

interface Props {
  groupId: string;
  wordCount?: number;
  onDelete: () => void;
  renderAddDialog: (p: { open: boolean; onOpenChange: (open: boolean) => void }) => ReactNode;
}

export const CardList = ({ groupId, wordCount, onDelete, renderAddDialog }: Props) => {
  return (
    <WordGrid groupId={groupId} wordCount={wordCount} onDelete={onDelete} renderAddDialog={renderAddDialog} />
  );
};

export { WordGrid } from './word-grid';
