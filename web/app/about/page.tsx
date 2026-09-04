import type { Metadata } from 'next';

import { AboutI18n } from './about-i18n';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Hanzi Handwriting Practice Online — Chinese Laoshi',
  description:
    'Write Chinese characters in your browser with stroke feedback. Free Mandarin flashcards, custom word groups, and translation drills — no app install required.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/about' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Chinese Laoshi',
      alternateName: '中国老师',
      url: 'https://chineselaoshi.slavoyar.tech/',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Chinese Laoshi free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Chinese Laoshi is completely free to use, including handwriting practice, translation drills, and custom flashcard decks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to install an app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Chinese Laoshi runs in your web browser on phone, tablet, or desktop — no download or app store required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I create my own flashcard decks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Build custom word groups with Chinese characters, pinyin, and translations, then study them with handwriting or translation modes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does hanzi handwriting practice work on phones?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Draw characters with your finger on a phone or tablet, or with a mouse on desktop, and get stroke-order feedback.',
          },
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className={styles.root}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AboutI18n />
      <header className={styles.header}>
        <div className={styles.bar}>
          <a className={styles.brand} href="/">
            中国老师
          </a>
          <a className={styles.back} href="/app" data-i18n="backToApp" data-testid="about-back-link">
            Back to app
          </a>
        </div>
      </header>
      <main className={styles.main}>
        <h1 data-i18n="title" data-testid="about-heading">
          Free Hanzi Handwriting Practice in Your Browser
        </h1>
        <p data-i18n="intro">
          Chinese Laoshi (中国老师) helps you write Chinese characters online and drill Mandarin
          translations with your own flashcards — free, in the browser on phone, tablet, or desktop.
        </p>

        <h2 data-i18n="featuresTitle">Features</h2>
        <ul>
          <li data-i18n="handwritingFeature">
            <strong className={styles.strong}>Handwriting practice</strong> — write Chinese characters
            with touch or mouse and get stroke feedback.
          </li>
          <li data-i18n="translationFeature">
            <strong className={styles.strong}>Translation drills</strong> — review meanings and
            strengthen recall with flashcard study modes.
          </li>
          <li data-i18n="customGroupsFeature">
            <strong className={styles.strong}>Custom word groups</strong> — build your own card decks
            with characters, pinyin, and translations.
          </li>
        </ul>

        <h2 data-i18n="howItWorksTitle">How it works</h2>
        <ol>
          <li data-i18n="howItWorksStep1">Open the app in your browser and try study modes in demo.</li>
          <li data-i18n="howItWorksStep2">Create word groups with characters, pinyin, and translations.</li>
          <li data-i18n="howItWorksStep3">Practice hanzi handwriting or run translation flashcard drills.</li>
          <li data-i18n="howItWorksStep4">Sign up free to save your vocabulary across devices.</li>
        </ol>

        <h2 data-i18n="faqTitle" data-testid="about-faq">
          FAQ
        </h2>
        <dl className={styles.faq}>
          <dt data-i18n="faqFreeQuestion">Is Chinese Laoshi free?</dt>
          <dd data-i18n="faqFreeAnswer">
            Yes. Chinese Laoshi is completely free, including handwriting practice, translation drills,
            and custom flashcard decks.
          </dd>
          <dt data-i18n="faqInstallQuestion">Do I need to install an app?</dt>
          <dd data-i18n="faqInstallAnswer">
            No. It runs in your web browser on phone, tablet, or desktop — no download required.
          </dd>
          <dt data-i18n="faqDecksQuestion">Can I create my own flashcard decks?</dt>
          <dd data-i18n="faqDecksAnswer">
            Yes. Build custom word groups with characters, pinyin, and translations, then study them
            with handwriting or translation modes.
          </dd>
          <dt data-i18n="faqPhoneQuestion">Does handwriting practice work on phones?</dt>
          <dd data-i18n="faqPhoneAnswer">
            Yes. Draw characters with your finger on a phone or tablet, or with a mouse on desktop, and
            get stroke-order feedback.
          </dd>
        </dl>

        <h2 data-i18n="openSourceTitle">Open source</h2>
        <p>
          <span data-i18n="openSourceBody">The project is open source on</span>{' '}
          <a href="https://github.com/slavoyar/ChineseLaoshi">GitHub</a>.
        </p>

        <div className={styles.panel}>
          <p>
            <strong data-i18n="contactTitle">Contact</strong>
          </p>
          <p>
            <span data-i18n="emailLabel">Email:</span>{' '}
            <a href="mailto:slavoyarmc@gmail.com">slavoyarmc@gmail.com</a>
          </p>
          <p>
            <span data-i18n="githubLabel">GitHub:</span>{' '}
            <a href="https://github.com/slavoyar/ChineseLaoshi">github.com/slavoyar/ChineseLaoshi</a>
          </p>
          <p>
            <span data-i18n="appLabel">App:</span>{' '}
            <a href="https://chineselaoshi.slavoyar.tech/app">chineselaoshi.slavoyar.tech/app</a>
          </p>
        </div>
      </main>
    </div>
  );
}
