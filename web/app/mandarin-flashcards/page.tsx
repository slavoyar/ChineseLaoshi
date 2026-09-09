import type { Metadata } from 'next';

import { FeatureI18n } from '../feature-i18n';
import { InnerLayout } from '../inner-layout';
import styles from '../inner-layout.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Mandarin flashcards — Chinese Laoshi',
  description:
    'Drill Mandarin translations with your own flashcards. Character, pinyin, and translation on each card. Free, no app install.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/mandarin-flashcards' },
};

export default function MandarinFlashcardsPage() {
  return (
    <InnerLayout
      before={
        <>
          <TelegramStudyRedirect />
          <FeatureI18n />
        </>
      }
      nav={
        <a className={styles.navLink} href="/" data-i18n="home">
          Home
        </a>
      }
    >
      <h1 data-i18n="flashTitle">Mandarin flashcards</h1>
      <p className={styles.lead} data-i18n="flashPitch">
        Drill Mandarin translations with your own flashcards. Review meanings and strengthen recall
        with flashcard study modes — character, pinyin, and translation on each card.
      </p>
      <a className={styles.cta} href="/app" data-i18n="cta">
        Start practicing
      </a>

      <h2 data-i18n="howTitle">How it works</h2>
      <ol>
        <li data-i18n="flashHow1">Open the app in your browser and try study modes in demo.</li>
        <li data-i18n="flashHow2">Create word groups with characters, pinyin, and translations.</li>
        <li data-i18n="flashHow3">Drill translations with flashcard modes — character, pinyin, and translation.</li>
        <li data-i18n="flashHow4">Sign up free to save your vocabulary across devices.</li>
      </ol>

      <nav className={styles.cross} aria-label="More">
        <a href="/hanzi-handwriting-practice" data-i18n="crossHanzi">
          Hanzi handwriting practice
        </a>
        <span aria-hidden="true">·</span>
        <a href="/about" data-i18n="crossAbout">
          About
        </a>
      </nav>
    </InnerLayout>
  );
}
