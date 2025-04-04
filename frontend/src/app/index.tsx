import './styles/index.css';
import './middlewares';

import router from '@app/router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer theme='dark' autoClose={1000} />
    <RouterProvider router={router} />
  </React.StrictMode>
);
