import Groups from '@widgets/groups';
import { useGroupStore } from '@entities/group';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';

const Main = () => {
  const fetchGroups = useGroupStore((state) => state.fetch);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups().catch(() => {
      navigate(Route.SignIn);
    });
  }, []);
  return (
    <div className='md:w-6/12 m-auto h-full'>
      <Groups />
    </div>
  );
};

export default Main;
