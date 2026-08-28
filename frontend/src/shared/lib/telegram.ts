interface TelegramWebApp {
  initData: string;
  initDataUnsafe: { user?: { id: number } };
  colorScheme: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  safeAreaInset: { top: number; bottom: number; left: number; right: number };
  contentSafeAreaInset: { top: number; bottom: number; left: number; right: number };
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const getTelegramWebApp = (): TelegramWebApp | null =>
  window.Telegram?.WebApp ?? null;

export const isTelegramMiniApp = (): boolean => {
  const webApp = getTelegramWebApp();
  return Boolean(webApp?.initData);
};

export const getTelegramInitData = (): string => getTelegramWebApp()?.initData ?? '';

export const initTelegramWebApp = (): void => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return;
  }

  webApp.ready();
  webApp.expand();
  webApp.requestFullscreen?.();

  const applyInsets = () => {
    const root = document.documentElement;
    root.style.setProperty('--tg-safe-top', `${webApp.safeAreaInset.top}px`);
    root.style.setProperty('--tg-safe-bottom', `${webApp.safeAreaInset.bottom}px`);
    root.style.setProperty('--tg-content-safe-top', `${webApp.contentSafeAreaInset.top}px`);
    root.style.setProperty('--tg-content-safe-bottom', `${webApp.contentSafeAreaInset.bottom}px`);
  };

  applyInsets();
  webApp.onEvent('safeAreaChanged', applyInsets);
  webApp.onEvent('contentSafeAreaChanged', applyInsets);
};

export const applyTelegramTheme = (): void => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return;
  }
  document.documentElement.classList.toggle('dark', webApp.colorScheme === 'dark');
};

export const initTelegramTheme = (): void => {
  if (!isTelegramMiniApp()) {
    return;
  }
  applyTelegramTheme();
  const webApp = getTelegramWebApp();
  webApp?.onEvent('themeChanged', applyTelegramTheme);
};

export const onTelegramActivated = (callback: () => void): (() => void) => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return () => undefined;
  }
  webApp.onEvent('activated', callback);
  return () => webApp.offEvent('activated', callback);
};

export const onTelegramDeactivated = (callback: () => void): (() => void) => {
  const webApp = getTelegramWebApp();
  if (!webApp) {
    return () => undefined;
  }
  webApp.onEvent('deactivated', callback);
  return () => webApp.offEvent('deactivated', callback);
};
