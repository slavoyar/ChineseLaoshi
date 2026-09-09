'use client';

import './styles/index.css';
import './axios';
import 'react-toastify/dist/ReactToastify.css';
import '@shared/lib/i18n';

import { AuthBootstrap } from '@app/auth-bootstrap';
import router from '@app/router';
import { TelegramLifecycle } from '@app/telegram-lifecycle';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  applyTelegramTheme,
  getTelegramWebApp,
  initTelegramTheme,
  initTelegramWebApp,
  isTelegramMiniApp,
} from '@shared/lib/telegram';
import { initSystemTheme, isDarkTheme, subscribeThemeChange } from '@shared/lib/theme';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, type ToastPosition } from 'react-toastify';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const MOBILE_TOAST_MQ = '(max-width: 767px)';

const resolveToastPosition = (): ToastPosition => {
  if (typeof window === 'undefined') {
    return 'top-right';
  }
  if (isTelegramMiniApp()) {
    return 'bottom-center';
  }
  if (window.matchMedia(MOBILE_TOAST_MQ).matches) {
    return 'bottom-center';
  }
  return 'top-right';
};

const useToastPosition = (): ToastPosition => {
  const [position, setPosition] = useState<ToastPosition>('top-right');

  useEffect(() => {
    setPosition(resolveToastPosition());
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
  const [toastTheme, setToastTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.add('study-app');

    if (isTelegramMiniApp()) {
      applyTelegramTheme();
      initTelegramTheme();
      initTelegramWebApp();
      document.documentElement.classList.add('telegram-mini-app');
    } else {
      initSystemTheme();
    }

    const sync = () => setToastTheme(isDarkTheme() ? 'dark' : 'light');
    sync();

    if (isTelegramMiniApp()) {
      const webApp = getTelegramWebApp();
      if (!webApp) {
        return;
      }
      webApp.onEvent('themeChanged', sync);
      return () => {
        webApp.offEvent('themeChanged', sync);
        document.documentElement.classList.remove('study-app');
      };
    }

    const unsubscribe = subscribeThemeChange(sync);
    return () => {
      unsubscribe();
      document.documentElement.classList.remove('study-app');
    };
  }, []);

  return (
    <div id='root'>
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
    </div>
  );
};

export function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AppShell />
    </GoogleOAuthProvider>
  );
}
