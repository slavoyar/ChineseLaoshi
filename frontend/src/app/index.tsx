import './styles/index.css';
import './axios';

import { AuthBootstrap } from '@app/auth-bootstrap';
import router from '@app/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthBootstrap>
        <ToastContainer theme='dark' autoClose={1000} />
        <RouterProvider router={router} />
      </AuthBootstrap>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
