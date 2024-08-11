import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { Header } from '@shared/ui';
import { useResizeObserver } from '@siberiacancode/reactuse';
import { useAuthStore } from '@shared/stores';
import { useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const HeaderLayout: FC<Props> = ({ children }) => {
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
    <div className='w-full h-full'>
      <Header ref={ref} username={username} />
      <div
        className='w-full absolute md:px-5 p-2'
        style={{
          height: `calc(100% - ${height}px)`,
          top: `${height}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HeaderLayout;
