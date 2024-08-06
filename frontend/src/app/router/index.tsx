import { createBrowserRouter } from 'react-router-dom';
import App from '@app/ui';
import Login from '@pages/auth';
import Main from '@pages/main';
import StudyWrite from '@pages/studyWrite';

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
    element: <StudyWrite />,
  },
  {
    path: '/',
    element: <Main />,
  },
]);

export default router;
