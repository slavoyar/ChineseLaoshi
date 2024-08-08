import { createBrowserRouter } from 'react-router-dom';
import App from '@app/ui';
import Login from '@pages/auth';
import Main from '@pages/main';
import StudyWrite from '@pages/studyWrite';
import { HeaderLayout } from '@shared/layouts';

const router = createBrowserRouter([
  {
    path: '/components',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/study/write/:groupId',
    element: (
      <HeaderLayout username='Slavoyar'>
        <StudyWrite />
      </HeaderLayout>
    ),
  },
  {
    path: '/',
    element: (
      <HeaderLayout username='Slavoyar'>
        <Main />
      </HeaderLayout>
    ),
  },
]);

export default router;
