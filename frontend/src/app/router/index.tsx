import { createBrowserRouter } from 'react-router-dom';
import { SignIn, SignUp } from '@pages/auth';
import Main from '@pages/main';
import StudyWrite from '@pages/studyWrite';
import { HeaderLayout } from '@shared/layouts';
import { Route } from '@shared/types';

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
    path: Route.StudyWrite,
    element: (
      <HeaderLayout>
        <StudyWrite />
      </HeaderLayout>
    ),
  },
  {
    path: Route.Root,
    element: (
      <HeaderLayout>
        <Main />
      </HeaderLayout>
    ),
  },
]);

export default router;
