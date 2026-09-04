'use client';

import { useEffect } from 'react';

import { loadTelegramSdk } from './load-telegram-sdk';

/** Hard-redirect Telegram Mini App into the study app. Never mount on /about. */
export function TelegramStudyRedirect() {
  useEffect(() => {
    let cancelled = false;

    loadTelegramSdk().then((tg) => {
      if (cancelled || !tg?.initData) {
        return;
      }
      location.replace('/app' + location.search + location.hash);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
