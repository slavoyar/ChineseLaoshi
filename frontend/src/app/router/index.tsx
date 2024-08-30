import { createBrowserRouter } from 'react-router-dom';
import { HeaderLayout } from '@shared/layouts';
import { Route } from '@shared/types';
import { SignIn } from '@pages/sign-in';
import { SignUp } from '@pages/sign-up';
import { Main } from '@pages/main';
import { StudyWrite } from '@pages/study-write';

const router = createBrowserRouter([
  {
    path: Route.SignIn,
    element: <SignIn />,
  },
  {
    path: Route.SignUp,
    element: <SignUp />,
  },
  {
    path: Route.Root,
    element: <HeaderLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: Route.StudyWrite,
        element: <StudyWrite />,
      },
    ],
  },
]);

export default router;
