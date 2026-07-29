import './styles/index.css';
import './axios';

import { AuthBootstrap } from '@app/auth-bootstrap';
import { RouteFallback } from '@app/route-fallback';
import router from '@app/router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthBootstrap>
        <ToastContainer theme='dark' autoClose={1000} />
        <Suspense fallback={<RouteFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthBootstrap>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
