import { HeaderLayout } from '@app/layouts';
import { Main } from '@pages/main';
import { NotFound, RouteError } from '@pages/not-found';
import { Route } from '@shared/types';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(
  [
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
              lazy: async () => {
                const { GroupDetail } = await import('@pages/group-detail');
                return { Component: GroupDetail };
              },
            },
            {
              path: `${Route.WritePractice}/:count/:groupId?`,
              lazy: async () => {
                const { WritePractice } = await import('@pages/write-practice');
                return { Component: WritePractice };
              },
            },
            {
              path: '*',
              element: <NotFound />,
            },
          ],
        },
      ],
    },
  ],
  { basename: '/app' }
);

export default router;
