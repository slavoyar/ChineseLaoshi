import { createBrowserRouter } from 'react-router-dom';
import { SignIn, SignUp } from '@pages/auth';
import Main from '@pages/main';
import StudyWrite from '@pages/studyWrite';
import { HeaderLayout } from '@shared/layouts';
import { Route } from '@shared/types';
import { cn } from '@shared/utils';

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
    path: cn(Route.StudyWrite, ':groupId'),
    element: (
      <HeaderLayout username='Slavoyar'>
        <StudyWrite />
      </HeaderLayout>
    ),
  },
  {
    path: Route.Root,
    element: (
      <HeaderLayout username='Slavoyar'>
        <Main />
      </HeaderLayout>
    ),
  },
]);

export default router;
