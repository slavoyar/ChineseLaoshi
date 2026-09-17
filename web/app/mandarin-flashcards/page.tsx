import type { Metadata } from 'next';

import { FeatureI18n } from '../feature-i18n';
import { InnerLayout } from '../inner-layout';
import styles from '../inner-layout.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Mandarin flashcards — Chinese Laoshi',
  description:
    'Drill your own Mandarin cards: character, pinyin, and translation. Pinyin, translation, and mixed quiz modes — free, no app install.',
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
        Drill your own cards with character, pinyin, and translation on each card. Choose a quiz
        mode — not a drawing pad.
      </p>
      <a className={styles.cta} href="/app" data-i18n="cta">
        Start practicing
      </a>

      <h2 data-i18n="flashSidesTitle">What is on each card</h2>
      <p data-i18n="flashSidesBody">
        Every card in a word group stores a Chinese character, pinyin, and a translation. You study
        that triple with quiz modes instead of handwriting.
      </p>

      <h2 data-i18n="flashModesTitle">Pinyin, translation, and mixed drills</h2>
      <p data-i18n="flashModesBody">
        Pinyin mode asks for the reading. Translation mode asks for the meaning. Mixed mode rotates
        prompts so a session is not the same question type every time.
      </p>

      <h2 data-i18n="flashDecksTitle">Custom decks</h2>
      <p data-i18n="flashDecksBody">
        Build word groups, add cards, then drill only that deck. Sign up free if you want the same
        vocabulary on more than one device.
      </p>

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
