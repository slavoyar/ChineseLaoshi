import { Main } from '@pages/main';
import { WritePractice } from '@pages/write-practice';
import { HeaderLayout } from '@shared/layouts';
import { Route } from '@shared/types';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: Route.Root,
    element: <HeaderLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: `${Route.WritePractice}/:count/:groupId?`,
        element: <WritePractice />,
      },
    ],
  },
]);

export default router;
