import { useGroupStore, Group } from '@entities/group';
import { Accordion } from '@shared/ui';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardStore } from '@entities/card';
import { Route } from '@shared/types';
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

  const onStudyClick = () => {
    setIsStudy(true);
    navigate(`/${Route.StudyWrite}`);
  };

  return (
    <Accordion
      sections={groups}
      rowKey={(item) => item.id}
      header={(item) => <GroupHeader name={item.name} wordCount={item.wordCount} />}
      actions={() => (
        <i
          className='fa fa-pencil-square hover:bg-secondary-600 rounded p-1 cursor-pointer'
          title='Study'
          onClick={() => onStudyClick()}
        />
      )}
      content={content}
      onOpen={onGroupOpen}
      onDelete={deleteHandler}
    />
  );
};
