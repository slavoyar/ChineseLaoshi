import { createBrowserRouter } from 'react-router-dom';
import App from '@app/ui';
import Login from '@pages/auth';

const router = createBrowserRouter([
  {
    path: '/components',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
