import type { Metadata } from 'next';

import { FeatureI18n } from '../feature-i18n';
import { InnerLayout } from '../inner-layout';
import styles from '../inner-layout.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Hanzi handwriting practice — Chinese Laoshi',
  description:
    'Write Chinese characters in your browser with stroke feedback. Draw with your finger or mouse. Free, no app install.',
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
        Write Chinese characters in your browser with stroke feedback. Draw with your finger on a
        phone or tablet, or with a mouse on desktop. Stroke-order feedback is part of handwriting
        practice — no extra app.
      </p>
      <a className={styles.cta} href="/app" data-i18n="cta">
        Start practicing
      </a>

      <h2 data-i18n="howTitle">How it works</h2>
      <ol>
        <li data-i18n="hanziHow1">Open the app in your browser and try handwriting in demo.</li>
        <li data-i18n="hanziHow2">Create word groups with characters, pinyin, and translations.</li>
        <li data-i18n="hanziHow3">Write Chinese characters with touch or mouse and get stroke feedback.</li>
        <li data-i18n="hanziHow4">Sign up free to save your vocabulary across devices.</li>
      </ol>

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
