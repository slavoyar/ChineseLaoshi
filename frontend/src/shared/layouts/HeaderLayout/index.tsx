import { FC, HTMLAttributes, useState } from 'react';
import { Header } from '@shared/ui';
import { useResizeObserver } from '@siberiacancode/reactuse';

interface Props extends HTMLAttributes<HTMLDivElement> {
  username: string;
}

const HeaderLayout: FC<Props> = ({ children, username }) => {
  const [height, setHeight] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onChange: ([entry]) => {
      const { height: h } = entry.contentRect;
      setHeight(h);
    },
  });
  return (
    <div className='w-full h-full'>
      <Header ref={ref} username={username} />
      <div
        className='w-full absolute p-5'
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
