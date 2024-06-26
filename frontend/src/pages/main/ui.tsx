import Groups from '@widgets/groups';
import { useGroupStore } from '@entities/group';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const fetchGroups = useGroupStore((state) => state.fetch);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups().catch(() => {
      navigate('/login');
    });
  }, []);
  return (
    <div className='w-8/12 m-auto'>
      <Groups />
    </div>
  );
};

export default Main;
