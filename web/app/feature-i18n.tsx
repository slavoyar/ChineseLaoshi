'use client';

import { useEffect } from 'react';

const copy = {
  en: {
    home: 'Home',
    cta: 'Start practicing',
    hanziTitle: 'Hanzi handwriting practice',
    hanziPitch:
      'Draw Chinese characters in the browser and get stroke feedback as you write. Finger on a phone or tablet, mouse on desktop — no extra app.',
    hanziStrokeTitle: 'Stroke feedback',
    hanziStrokeBody:
      'Handwriting mode watches each stroke you draw. Use it to train muscle memory for characters in your word groups, not just to recognize them on a card.',
    hanziOrderTitle: 'Stroke order',
    hanziOrderBody:
      'Stroke-order practice walks through the sequence for each character in a group. It is a separate study mode from flashcard quizzes.',
    hanziDevicesTitle: 'Phone, tablet, or desktop',
    hanziDevicesBody:
      'Draw with your finger on a touch screen or with a mouse on a computer. The same handwriting pad runs in the browser on all of them.',
    flashTitle: 'Mandarin flashcards',
    flashPitch:
      'Drill your own cards with character, pinyin, and translation on each card. Choose a quiz mode — not a drawing pad.',
    flashSidesTitle: 'What is on each card',
    flashSidesBody:
      'Every card in a word group stores a Chinese character, pinyin, and a translation. You study that triple with quiz modes instead of handwriting.',
    flashModesTitle: 'Pinyin, translation, and mixed drills',
    flashModesBody:
      'Pinyin mode asks for the reading. Translation mode asks for the meaning. Mixed mode rotates prompts so a session is not the same question type every time.',
    flashDecksTitle: 'Custom decks',
    flashDecksBody:
      'Build word groups, add cards, then drill only that deck. Sign up free if you want the same vocabulary on more than one device.',
    crossHanzi: 'Hanzi handwriting practice',
    crossFlash: 'Mandarin flashcards',
    crossAbout: 'About',
  },
  ru: {
    home: 'Главная',
    cta: 'Начать практику',
    hanziTitle: 'Письмо иероглифов',
    hanziPitch:
      'Рисуйте иероглифы в браузере и получайте обратную связь по чертам. Пальцем на телефоне или планшете, мышью на компьютере — без отдельного приложения.',
    hanziStrokeTitle: 'Обратная связь по чертам',
    hanziStrokeBody:
      'Режим письма следит за каждой чертой. Так тренируется моторная память для иероглифов в ваших группах, а не только узнавание на карточке.',
    hanziOrderTitle: 'Порядок черт',
    hanziOrderBody:
      'Режим порядка черт проводит по последовательности для каждого иероглифа в группе. Это отдельный режим, не викторина по карточкам.',
    hanziDevicesTitle: 'Телефон, планшет или компьютер',
    hanziDevicesBody:
      'Рисуйте пальцем на сенсорном экране или мышью на компьютере. Одна и та же панель письма работает в браузере везде.',
    flashTitle: 'Карточки мандарина',
    flashPitch:
      'Тренируйте свои карточки с иероглифом, пиньинем и переводом. Выберите режим викторины — не панель для письма.',
    flashSidesTitle: 'Что на карточке',
    flashSidesBody:
      'У каждой карточки в группе есть иероглиф, пиньинь и перевод. Эту тройку вы учите в режимах викторины, а не письмом.',
    flashModesTitle: 'Пиньинь, перевод и смешанные тренировки',
    flashModesBody:
      'Режим пиньиня спрашивает чтение. Режим перевода — значение. Смешанный режим чередует подсказки, чтобы сессия не была одним типом вопроса.',
    flashDecksTitle: 'Свои колоды',
    flashDecksBody:
      'Соберите группы слов, добавьте карточки и тренируйте только эту колоду. Зарегистрируйтесь бесплатно, чтобы словарь был на нескольких устройствах.',
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
      if (key && copy[lang][key] && el.childElementCount === 0) {
        el.textContent = copy[lang][key];
      }
    });
  }, []);

  return null;
}
