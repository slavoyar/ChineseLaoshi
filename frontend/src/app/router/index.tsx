import { createBrowserRouter } from 'react-router-dom';
import App from '@app/ui';
import Login from '@pages/auth';
import Main from '@pages/main';

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
    path: '/',
    element: <Main />,
  },
]);

export default router;
