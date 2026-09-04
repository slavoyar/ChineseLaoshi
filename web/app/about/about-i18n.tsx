'use client';

import { useEffect } from 'react';

const copy = {
  en: {
    backToApp: 'Back to app',
    title: 'Free Hanzi Handwriting Practice in Your Browser',
    intro:
      'Chinese Laoshi (中国老师) helps you write Chinese characters online and drill Mandarin translations with your own flashcards — free, in the browser on phone, tablet, or desktop.',
    featuresTitle: 'Features',
    handwritingFeature:
      'Handwriting practice — write Chinese characters with touch or mouse and get stroke feedback.',
    translationFeature:
      'Translation drills — review meanings and strengthen recall with flashcard study modes.',
    customGroupsFeature:
      'Custom word groups — build your own card decks with characters, pinyin, and translations.',
    howItWorksTitle: 'How it works',
    howItWorksStep1: 'Open the app in your browser and try study modes in demo.',
    howItWorksStep2: 'Create word groups with characters, pinyin, and translations.',
    howItWorksStep3: 'Practice hanzi handwriting or run translation flashcard drills.',
    howItWorksStep4: 'Sign up free to save your vocabulary across devices.',
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
    faqPhoneQuestion: 'Does handwriting practice work on phones?',
    faqPhoneAnswer:
      'Yes. Draw characters with your finger on a phone or tablet, or with a mouse on desktop, and get stroke-order feedback.',
    openSourceTitle: 'Open source',
    openSourceBody: 'The project is open source on',
    contactTitle: 'Contact',
    emailLabel: 'Email:',
    githubLabel: 'GitHub:',
    appLabel: 'App:',
  },
  ru: {
    backToApp: 'В приложение',
    title: 'Бесплатная практика написания иероглифов в браузере',
    intro:
      'Chinese Laoshi (中国老师) помогает писать иероглифы онлайн и тренировать переводы с собственными карточками — бесплатно в браузере на телефоне, планшете или компьютере.',
    featuresTitle: 'Возможности',
    handwritingFeature:
      'Письмо — рисуйте иероглифы пальцем или мышью и получайте обратную связь по чертам.',
    translationFeature: 'Перевод — повторяйте значения и тренируйте запоминание в режимах карточек.',
    customGroupsFeature: 'Свои группы слов — собирайте колоды с иероглифами, пиньинем и переводами.',
    howItWorksTitle: 'Как это работает',
    howItWorksStep1: 'Откройте приложение в браузере и попробуйте режимы обучения в демо.',
    howItWorksStep2: 'Создайте группы слов с иероглифами, пиньинем и переводами.',
    howItWorksStep3: 'Тренируйте письмо иероглифов или переводы в режиме карточек.',
    howItWorksStep4: 'Зарегистрируйтесь бесплатно, чтобы сохранять словарь на всех устройствах.',
    faqTitle: 'Частые вопросы',
    faqFreeQuestion: 'Chinese Laoshi бесплатен?',
    faqFreeAnswer: 'Да. Приложение полностью бесплатное: письмо, переводы и свои колоды карточек.',
    faqInstallQuestion: 'Нужно ли устанавливать приложение?',
    faqInstallAnswer: 'Нет. Всё работает в браузере на телефоне, планшете или компьютере — без загрузки.',
    faqDecksQuestion: 'Можно создавать свои колоды карточек?',
    faqDecksAnswer:
      'Да. Собирайте группы с иероглифами, пиньинем и переводами и учите их в режимах письма или перевода.',
    faqPhoneQuestion: 'Письмо работает на телефоне?',
    faqPhoneAnswer:
      'Да. Рисуйте иероглифы пальцем на телефоне или планшете, или мышью на компьютере — с обратной связью по чертам.',
    openSourceTitle: 'Открытый код',
    openSourceBody: 'Проект с открытым исходным кодом на',
    contactTitle: 'Контакты',
    emailLabel: 'Email:',
    githubLabel: 'GitHub:',
    appLabel: 'Приложение:',
  },
} as const;

export function AboutI18n() {
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
