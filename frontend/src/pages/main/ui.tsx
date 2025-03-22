import { useGroupStore } from '@entities/group';
import { Route } from '@shared/types';
import { Groups } from '@widgets/groups';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const fetchGroups = useGroupStore((state) => state.fetch);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups().catch(() => {
      navigate(Route.SignIn);
    });
  }, []);
  return (
    <div className='m-auto h-full md:w-6/12'>
      <Groups />
    </div>
  );
};

export default Main;
