import './styles/index.css';
import './axios';
import 'react-toastify/dist/ReactToastify.css';

import { AuthBootstrap } from '@app/auth-bootstrap';
import { TelegramLifecycle } from '@app/telegram-lifecycle';
import router from '@app/router';
import { initSystemTheme, isDarkTheme, subscribeThemeChange } from '@shared/lib/theme';
import { applyTelegramTheme, getTelegramWebApp, initTelegramWebApp, initTelegramTheme, isTelegramMiniApp } from '@shared/lib/telegram';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, type ToastPosition } from 'react-toastify';

if (isTelegramMiniApp()) {
  applyTelegramTheme();
  initTelegramTheme();
  initTelegramWebApp();
  document.documentElement.classList.add('telegram-mini-app');
} else {
  initSystemTheme();
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
const MOBILE_TOAST_MQ = '(max-width: 767px)';

const resolveToastPosition = (): ToastPosition => {
  if (isTelegramMiniApp()) {
    return 'bottom-center';
  }
  if (typeof window !== 'undefined' && window.matchMedia(MOBILE_TOAST_MQ).matches) {
    return 'bottom-center';
  }
  return 'top-right';
};

const useToastPosition = (): ToastPosition => {
  const [position, setPosition] = useState<ToastPosition>(resolveToastPosition);

  useEffect(() => {
    if (isTelegramMiniApp()) {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_TOAST_MQ);
    const sync = () => setPosition(mediaQuery.matches ? 'bottom-center' : 'top-right');
    mediaQuery.addEventListener('change', sync);
    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  return position;
};

const AppShell = () => {
  const toastPosition = useToastPosition();
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
    <>
      <TelegramLifecycle />
      <AuthBootstrap>
        <ToastContainer
          className='app-toast-container'
          theme={toastTheme}
          position={toastPosition}
          autoClose={2500}
          hideProgressBar={false}
          closeOnClick
          draggable={false}
        />
        <RouterProvider router={router} />
      </AuthBootstrap>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppShell />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
