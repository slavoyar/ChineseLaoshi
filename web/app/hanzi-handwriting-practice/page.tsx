import type { Metadata } from 'next';

import { FeatureI18n } from '../feature-i18n';
import { InnerLayout } from '../inner-layout';
import styles from '../inner-layout.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Hanzi handwriting practice — Chinese Laoshi',
  description:
    'Draw Chinese characters in the browser with stroke feedback. Stroke-order practice, finger or mouse — free, no app install.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/hanzi-handwriting-practice' },
};

export default function HanziHandwritingPracticePage() {
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
      <h1 data-i18n="hanziTitle">Hanzi handwriting practice</h1>
      <p className={styles.lead} data-i18n="hanziPitch">
        Draw Chinese characters in the browser and get stroke feedback as you write. Finger on a
        phone or tablet, mouse on desktop — no extra app.
      </p>
      <a className={styles.cta} href="/app" data-i18n="cta">
        Start practicing
      </a>

      <h2 data-i18n="hanziStrokeTitle">Stroke feedback</h2>
      <p data-i18n="hanziStrokeBody">
        Handwriting mode watches each stroke you draw. Use it to train muscle memory for characters
        in your word groups, not just to recognize them on a card.
      </p>

      <h2 data-i18n="hanziOrderTitle">Stroke order</h2>
      <p data-i18n="hanziOrderBody">
        Stroke-order practice walks through the sequence for each character in a group. It is a
        separate study mode from flashcard quizzes.
      </p>

      <h2 data-i18n="hanziDevicesTitle">Phone, tablet, or desktop</h2>
      <p data-i18n="hanziDevicesBody">
        Draw with your finger on a touch screen or with a mouse on a computer. The same handwriting
        pad runs in the browser on all of them.
      </p>

      <nav className={styles.cross} aria-label="More">
        <a href="/mandarin-flashcards" data-i18n="crossFlash">
          Mandarin flashcards
        </a>
        <span aria-hidden="true">·</span>
        <a href="/about" data-i18n="crossAbout">
          About
        </a>
      </nav>
    </InnerLayout>
  );
}
