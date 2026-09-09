import { getTelegramWebApp } from './telegram';

export const detectLanguage = (): string => {
  const tgLang = getTelegramWebApp()?.initDataUnsafe?.user?.language_code;
  if (tgLang?.toLowerCase().startsWith('ru')) {
    return 'ru';
  }

  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('ru')) {
    return 'ru';
  }

  return 'en';
};
