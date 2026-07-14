import { WordGrid } from './word-grid';

interface Props {
  groupId: string;
  wordCount?: number;
  onDelete: () => void;
}

export const CardList = ({ groupId, wordCount, onDelete }: Props) => {
  return <WordGrid groupId={groupId} wordCount={wordCount} onDelete={onDelete} />;
};

export { WordGrid } from './word-grid';
