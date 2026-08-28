import './styles/index.css';
import './axios';

import { AuthBootstrap } from '@app/auth-bootstrap';
import router from '@app/router';
import { initSystemTheme, isDarkTheme } from '@shared/lib/theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

initSystemTheme();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

const AppShell = () => {
  const [toastTheme, setToastTheme] = useState<'light' | 'dark'>(() =>
    isDarkTheme() ? 'dark' : 'light'
  );

  useEffect(() => {
    const sync = () => setToastTheme(isDarkTheme() ? 'dark' : 'light');
    sync();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', sync);
    };
  }, []);

  return (
    <AuthBootstrap>
      <ToastContainer theme={toastTheme} autoClose={1000} />
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppShell />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
