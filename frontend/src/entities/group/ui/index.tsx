import { GroupDto } from '@chinese-laoshi/shared';
import { useGroupStore } from '@entities/group';
import { Accordion } from '@shared/ui';
import { ReactNode } from 'react';

import { GroupHeader } from './group-header';

interface Props {
  content: (item: GroupDto) => ReactNode;
  onGroupOpen: (item: GroupDto) => void;
}

export const GroupList = ({ content, onGroupOpen }: Props) => {
  const [groups, deleteGroup] = useGroupStore((state) => [state.groups, state.delete]);

  const deleteHandler = async (item: GroupDto) => {
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
