'use client';

import { useEffect } from 'react';

const year = new Date().getFullYear();

const copy = {
  en: {
    footerCopyright: `© ${year} Chinese Laoshi`,
    footerTagline: 'Free Mandarin flashcards and hanzi handwriting in the browser.',
    footerAbout: 'About',
  },
  ru: {
    footerCopyright: `© ${year} Chinese Laoshi`,
    footerTagline: 'Бесплатные карточки и практика написания иероглифов в браузере.',
    footerAbout: 'О приложении',
  },
} as const;

export function SiteFooterI18n() {
  useEffect(() => {
    const tgLang = (
      window as Window & {
        Telegram?: { WebApp?: { initDataUnsafe?: { user?: { language_code?: string } } } };
      }
    ).Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
    let lang: keyof typeof copy = tgLang?.toLowerCase().startsWith('ru') ? 'ru' : 'en';
    if (!tgLang && navigator.language.toLowerCase().startsWith('ru')) {
      lang = 'ru';
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n') as keyof (typeof copy)['en'] | null;
      if (key && copy[lang][key]) {
        el.textContent = copy[lang][key];
      }
    });
  }, []);

  return null;
}
