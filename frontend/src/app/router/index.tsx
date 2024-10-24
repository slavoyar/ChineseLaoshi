import { createBrowserRouter } from 'react-router-dom';
import { HeaderLayout } from '@shared/layouts';
import { Route } from '@shared/types';
import { SignIn } from '@pages/sign-in';
import { SignUp } from '@pages/sign-up';
import { Main } from '@pages/main';
import { ResetPassword } from '@pages/reset-password';
import { UpdatePassword } from '@pages/update-password';
import { WritePractice } from '@pages/write-practice';

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
    path: Route.ResetPassword,
    element: <ResetPassword />,
  },
  {
    path: Route.UpdatePassword,
    element: <UpdatePassword />,
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
        path: `${Route.WritePractice}/:count/:groupId?`,
        element: <WritePractice />,
      },
    ],
  },
]);

export default router;
