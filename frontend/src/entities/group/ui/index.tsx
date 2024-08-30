import { useGroupStore, Group } from '@entities/group';
import { Accordion } from '@shared/ui';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardStore } from '@entities/card';
import { GroupHeader } from './group-header';

interface Props {
  content: (item: Group) => ReactNode;
  onGroupOpen: (item: Group) => void;
}

export const GroupList: FC<Props> = ({ content, onGroupOpen }) => {
  const [groups, deleteGroup] = useGroupStore((state) => [state.groups, state.delete]);
  const navigate = useNavigate();
  const setIsStudy = useCardStore((state) => state.setIsStudy);

  const deleteHandler = async (item: Group) => {
    await deleteGroup(item.id);
  };

  const onStudyClick = (id: string) => {
    setIsStudy(true);
    navigate(`/study/write/${id}`);
  };

  return (
    <Accordion
      sections={groups}
      rowKey={(item) => item.id}
      header={(item) => <GroupHeader name={item.name} wordCount={item.wordCount} />}
      actions={(item) => (
        <i
          className='fa fa-pencil-square hover:bg-secondary-600 rounded p-1 cursor-pointer'
          title='Study'
          onClick={() => onStudyClick(item.id)}
        />
      )}
      content={content}
      onOpen={onGroupOpen}
      onDelete={deleteHandler}
    />
  );
};
