import { useGroupStore, Group } from '@entities/group';
import { Accordion } from '@shared/ui';
import { FC, ReactNode } from 'react';
import GroupHeader from './GroupHeader';

interface Props {
  content: (item: Group) => ReactNode;
  onGroupOpen: (item: Group) => void;
}

const GroupList: FC<Props> = ({ content, onGroupOpen }) => {
  const [groups, deleteGroup] = useGroupStore((state) => [state.groups, state.delete]);

  const deleteHandler = async (item: Group) => {
    await deleteGroup(item.id);
  };
  return (
    <Accordion
      sections={groups}
      rowKey={(item) => item.id}
      header={(item) => <GroupHeader name={item.name} wordCount={item.wordCount} />}
      content={content}
      onOpen={onGroupOpen}
      onDelete={deleteHandler}
    />
  );
};

export default GroupList;
