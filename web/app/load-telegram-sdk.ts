const TELEGRAM_SDK_SRC = 'https://telegram.org/js/telegram-web-app.js';

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: { user?: { language_code?: string } };
  ready?: () => void;
  expand?: () => void;
  requestFullscreen?: () => void;
  safeAreaInset?: { top: number; bottom: number };
  contentSafeAreaInset?: { top: number; bottom: number };
  onEvent?: (event: string, callback: () => void) => void;
  offEvent?: (event: string, callback: () => void) => void;
};

function getTelegramWebApp(): TelegramWebApp | undefined {
  return (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

/** Signal ready, expand, and set safe-area CSS variables used by marketing pages. */
export function initTelegramWebApp(webApp: TelegramWebApp): () => void {
  webApp.ready?.();
  webApp.expand?.();
  webApp.requestFullscreen?.();

  const applyInsets = () => {
    const root = document.documentElement;
    if (webApp.safeAreaInset) {
      root.style.setProperty('--tg-safe-top', `${webApp.safeAreaInset.top}px`);
      root.style.setProperty('--tg-safe-bottom', `${webApp.safeAreaInset.bottom}px`);
    }
    if (webApp.contentSafeAreaInset) {
      root.style.setProperty('--tg-content-safe-top', `${webApp.contentSafeAreaInset.top}px`);
      root.style.setProperty('--tg-content-safe-bottom', `${webApp.contentSafeAreaInset.bottom}px`);
    }
  };

  applyInsets();
  webApp.onEvent?.('safeAreaChanged', applyInsets);
  webApp.onEvent?.('contentSafeAreaChanged', applyInsets);

  return () => {
    webApp.offEvent?.('safeAreaChanged', applyInsets);
    webApp.offEvent?.('contentSafeAreaChanged', applyInsets);
  };
}

/** Load Telegram WebApp SDK after mount. Safe for hydration (not in SSR HTML). */
export function loadTelegramSdk(): Promise<TelegramWebApp | undefined> {
  const existing = getTelegramWebApp();
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const done = () => resolve(getTelegramWebApp());
    const found = document.querySelector<HTMLScriptElement>(`script[src="${TELEGRAM_SDK_SRC}"]`);
    if (found) {
      found.addEventListener('load', done);
      found.addEventListener('error', () => resolve(undefined));
      return;
    }

    const script = document.createElement('script');
    script.src = TELEGRAM_SDK_SRC;
    script.async = true;
    script.onload = done;
    script.onerror = () => resolve(undefined);
    document.head.appendChild(script);
  });
}
