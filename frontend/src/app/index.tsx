import './styles/index.css';
import './axios';
import 'react-toastify/dist/ReactToastify.css';

import { AuthBootstrap } from '@app/auth-bootstrap';
import { TelegramLifecycle } from '@app/telegram-lifecycle';
import router from '@app/router';
import { initSystemTheme, isDarkTheme, subscribeThemeChange } from '@shared/lib/theme';
import { applyTelegramTheme, getTelegramWebApp, isTelegramMiniApp } from '@shared/lib/telegram';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

initSystemTheme();
if (isTelegramMiniApp()) {
  applyTelegramTheme();
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

const AppShell = () => {
  const [toastTheme, setToastTheme] = useState<'light' | 'dark'>(() =>
    isDarkTheme() ? 'dark' : 'light'
  );

  useEffect(() => {
    const sync = () => setToastTheme(isDarkTheme() ? 'dark' : 'light');
    sync();

    if (isTelegramMiniApp()) {
      const webApp = getTelegramWebApp();
      if (!webApp) {
        return;
      }
      webApp.onEvent('themeChanged', sync);
      return () => webApp.offEvent('themeChanged', sync);
    }

    return subscribeThemeChange(sync);
  }, []);

  return (
    <AuthBootstrap>
      <TelegramLifecycle />
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
