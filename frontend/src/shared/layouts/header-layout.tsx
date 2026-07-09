import { Header } from '@shared/ui';
import { useResizeObserver } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export const HeaderLayout = () => {
  const [height, setHeight] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      const { height: h } = entry.contentRect;
      setHeight(h);
    },
  });

  return (
    <div className='h-full w-full'>
      <Header ref={ref} />
      <main
        className='absolute w-full p-2 md:px-5'
        style={{
          height: `calc(100% - ${height}px)`,
          top: `${height}px`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
