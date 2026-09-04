'use client';

import { useEffect } from 'react';

const copy = {
  en: {
    about: 'About',
    title: 'Free hanzi practice in your browser',
    pitch:
      'Chinese Laoshi (中国老师) helps you write Chinese characters online and drill Mandarin translations with custom flashcard decks — free, on phone, tablet, or desktop. No app install.',
    cta: 'Start practicing',
    handwritingTitle: 'Hanzi handwriting practice',
    handwritingBody:
      'Write Chinese characters in your browser with stroke feedback. Draw with your finger on a phone or tablet, or with a mouse on desktop. Stroke-order feedback is part of handwriting practice — no extra app.',
    flashcardsTitle: 'Mandarin flashcards',
    flashcardsBody:
      'Drill Mandarin translations with your own flashcards. Review meanings and strengthen recall with flashcard study modes — character, pinyin, and translation on each card.',
    modesTitle: 'Study modes',
    modesIntro:
      'Pick handwriting, stroke order, pinyin, translation, or mixed practice for all groups.',
    modeWrite: 'Handwriting',
    modeWriteBody: 'Write Chinese characters with touch or mouse and get stroke feedback.',
    modeStroke: 'Stroke order',
    modeStrokeBody: 'Practice stroke order for characters in your word groups.',
    modePinyin: 'Pinyin',
    modePinyinBody: 'Pick the pinyin for the character you are studying.',
    modeTranslation: 'Translation',
    modeTranslationBody: 'Pick the translation and strengthen recall with flashcard drills.',
    modeMixed: 'Mixed',
    modeMixedBody: 'Mix handwriting, pinyin, and translation practice in one session.',
    decksTitle: 'Custom word groups',
    decksBody:
      'Build custom word groups with Chinese characters, pinyin, and translations, then study them with handwriting or translation modes. Organize vocabulary into groups, open a group to add words, and study that deck.',
    freeTitle: 'Free, no app install',
    freeBody:
      'Chinese Laoshi is completely free, including handwriting practice, translation drills, and custom flashcard decks. It runs in your web browser on phone, tablet, or desktop — no download or app store required.',
    howTitle: 'How it works',
    how1: 'Open the app in your browser and try study modes in demo.',
    how2: 'Create word groups with characters, pinyin, and translations.',
    how3: 'Practice hanzi handwriting or run translation flashcard drills.',
    how4: 'Sign up free to save your vocabulary across devices.',
    closeTitle: 'Open the study app',
    closeBody: 'Start a handwriting or flashcard session in the browser. Free, no install.',
    faqTitle: 'FAQ',
    faqFreeQuestion: 'Is Chinese Laoshi free?',
    faqFreeAnswer:
      'Yes. Chinese Laoshi is completely free, including handwriting practice, translation drills, and custom flashcard decks.',
    faqInstallQuestion: 'Do I need to install an app?',
    faqInstallAnswer:
      'No. It runs in your web browser on phone, tablet, or desktop — no download required.',
    faqDecksQuestion: 'Can I create my own flashcard decks?',
    faqDecksAnswer:
      'Yes. Build custom word groups with characters, pinyin, and translations, then study them with handwriting or translation modes.',
    faqPhoneQuestion: 'Does hanzi handwriting practice work on phones?',
    faqPhoneAnswer:
      'Yes. Draw characters with your finger on a phone or tablet, or with a mouse on desktop, and get stroke-order feedback.',
  },
  ru: {
    about: 'О проекте',
    title: 'Бесплатная практика иероглифов в браузере',
    pitch:
      'Chinese Laoshi (中国老师) помогает писать иероглифы онлайн и тренировать переводы с собственными колодами карточек — бесплатно на телефоне, планшете или компьютере. Без установки приложения.',
    cta: 'Начать практику',
    handwritingTitle: 'Письмо иероглифов',
    handwritingBody:
      'Пишите иероглифы в браузере с обратной связью по чертам. Рисуйте пальцем на телефоне или планшете, или мышью на компьютере. Обратная связь по порядку черт входит в режим письма — без отдельного приложения.',
    flashcardsTitle: 'Карточки мандарина',
    flashcardsBody:
      'Тренируйте переводы с собственными карточками. Повторяйте значения в режимах карточек — иероглиф, пиньинь и перевод на каждой карточке.',
    modesTitle: 'Режимы обучения',
    modesIntro: 'Выберите письмо, порядок черт, пиньинь, перевод или смешанную практику для всех групп.',
    modeWrite: 'Письмо',
    modeWriteBody: 'Пишите иероглифы пальцем или мышью и получайте обратную связь по чертам.',
    modeStroke: 'Порядок черт',
    modeStrokeBody: 'Тренируйте порядок черт для иероглифов в ваших группах слов.',
    modePinyin: 'Пиньинь',
    modePinyinBody: 'Выберите пиньинь для изучаемого иероглифа.',
    modeTranslation: 'Перевод',
    modeTranslationBody: 'Выберите перевод и тренируйте запоминание в режиме карточек.',
    modeMixed: 'Смешанный',
    modeMixedBody: 'Смешивайте письмо, пиньинь и перевод в одной сессии.',
    decksTitle: 'Свои группы слов',
    decksBody:
      'Собирайте группы с иероглифами, пиньинем и переводами и учите их в режимах письма или перевода. Откройте группу, чтобы добавить слова и заниматься этой колодой.',
    freeTitle: 'Бесплатно, без установки',
    freeBody:
      'Chinese Laoshi полностью бесплатен: письмо, переводы и свои колоды карточек. Работает в браузере на телефоне, планшете или компьютере — без загрузки из магазина приложений.',
    howTitle: 'Как это работает',
    how1: 'Откройте приложение в браузере и попробуйте режимы обучения в демо.',
    how2: 'Создайте группы слов с иероглифами, пиньинем и переводами.',
    how3: 'Тренируйте письмо иероглифов или переводы в режиме карточек.',
    how4: 'Зарегистрируйтесь бесплатно, чтобы сохранять словарь на всех устройствах.',
    closeTitle: 'Открыть приложение',
    closeBody: 'Начните сессию письма или карточек в браузере. Бесплатно, без установки.',
    faqTitle: 'Частые вопросы',
    faqFreeQuestion: 'Chinese Laoshi бесплатен?',
    faqFreeAnswer: 'Да. Приложение полностью бесплатное: письмо, переводы и свои колоды карточек.',
    faqInstallQuestion: 'Нужно ли устанавливать приложение?',
    faqInstallAnswer: 'Нет. Всё работает в браузере на телефоне, планшете или компьютере — без загрузки.',
    faqDecksQuestion: 'Можно создавать свои колоды карточек?',
    faqDecksAnswer:
      'Да. Собирайте группы с иероглифами, пиньинем и переводами и учите их в режимах письма или перевода.',
    faqPhoneQuestion: 'Письмо иероглифов работает на телефоне?',
    faqPhoneAnswer:
      'Да. Рисуйте иероглифы пальцем на телефоне или планшете, или мышью на компьютере — с обратной связью по чертам.',
  },
} as const;

export function HomeI18n() {
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
