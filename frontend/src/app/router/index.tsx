import { GroupDetail } from '@pages/group-detail';
import { Main } from '@pages/main';
import { NotFound, RouteError } from '@pages/not-found';
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
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            element: <Main />,
          },
          {
            path: `${Route.Groups}/:groupId`,
            element: <GroupDetail />,
          },
          {
            path: `${Route.WritePractice}/:count/:groupId?`,
            element: <WritePractice />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
