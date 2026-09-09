'use client';

import { useEffect } from 'react';

const copy = {
  en: {
    home: 'Home',
    cta: 'Start practicing',
    howTitle: 'How it works',
    hanziTitle: 'Hanzi handwriting practice',
    hanziPitch:
      'Write Chinese characters in your browser with stroke feedback. Draw with your finger on a phone or tablet, or with a mouse on desktop. Stroke-order feedback is part of handwriting practice — no extra app.',
    hanziHow1: 'Open the app in your browser and try handwriting in demo.',
    hanziHow2: 'Create word groups with characters, pinyin, and translations.',
    hanziHow3: 'Write Chinese characters with touch or mouse and get stroke feedback.',
    hanziHow4: 'Sign up free to save your vocabulary across devices.',
    flashTitle: 'Mandarin flashcards',
    flashPitch:
      'Drill Mandarin translations with your own flashcards. Review meanings and strengthen recall with flashcard study modes — character, pinyin, and translation on each card.',
    flashHow1: 'Open the app in your browser and try study modes in demo.',
    flashHow2: 'Create word groups with characters, pinyin, and translations.',
    flashHow3: 'Drill translations with flashcard modes — character, pinyin, and translation.',
    flashHow4: 'Sign up free to save your vocabulary across devices.',
    crossHanzi: 'Hanzi handwriting practice',
    crossFlash: 'Mandarin flashcards',
    crossAbout: 'About',
  },
  ru: {
    home: 'Главная',
    cta: 'Начать практику',
    howTitle: 'Как это работает',
    hanziTitle: 'Письмо иероглифов',
    hanziPitch:
      'Пишите иероглифы в браузере с обратной связью по чертам. Рисуйте пальцем на телефоне или планшете, или мышью на компьютере. Обратная связь по порядку черт входит в режим письма — без отдельного приложения.',
    hanziHow1: 'Откройте приложение в браузере и попробуйте письмо в демо.',
    hanziHow2: 'Создайте группы слов с иероглифами, пиньинем и переводами.',
    hanziHow3: 'Пишите иероглифы пальцем или мышью и получайте обратную связь по чертам.',
    hanziHow4: 'Зарегистрируйтесь бесплатно, чтобы сохранять словарь на всех устройствах.',
    flashTitle: 'Карточки мандарина',
    flashPitch:
      'Тренируйте переводы с собственными карточками. Повторяйте значения в режимах карточек — иероглиф, пиньинь и перевод на каждой карточке.',
    flashHow1: 'Откройте приложение в браузере и попробуйте режимы обучения в демо.',
    flashHow2: 'Создайте группы слов с иероглифами, пиньинем и переводами.',
    flashHow3: 'Тренируйте переводы в режиме карточек — иероглиф, пиньинь и перевод.',
    flashHow4: 'Зарегистрируйтесь бесплатно, чтобы сохранять словарь на всех устройствах.',
    crossHanzi: 'Письмо иероглифов',
    crossFlash: 'Карточки мандарина',
    crossAbout: 'О проекте',
  },
} as const;

export function FeatureI18n() {
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

    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n') as keyof (typeof copy)['en'] | null;
      if (key && copy[lang][key]) {
        el.textContent = copy[lang][key];
      }
    });
  }, []);

  return null;
}
