import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Header } from '@shared/ui';
import { useResizeObserver } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export const HeaderLayout = () => {
  const [height, setHeight] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      const { height: h } = entry.contentRect;
      setHeight(h);
    },
  });

  const username = useAuthStore((state) => state.username);

  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate(Route.SignIn);
    }
  }, [username]);

  return (
    <div className='h-full w-full'>
      <Header ref={ref} username={username} />
      <div
        className='absolute w-full p-2 md:px-5'
        style={{
          height: `calc(100% - ${height}px)`,
          top: `${height}px`,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
