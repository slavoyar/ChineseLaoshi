import type { Metadata } from 'next';

import styles from '../home.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Hanzi handwriting practice — Chinese Laoshi',
  description: 'Write Chinese characters in your browser with stroke feedback.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/hanzi-handwriting-practice' },
};

export default function HanziHandwritingPracticePage() {
  return (
    <div className={styles.root}>
      <TelegramStudyRedirect />
      <header className={styles.header}>
        <div className={styles.bar}>
          <a className={styles.brand} href="/">
            中国老师
          </a>
          <a className={styles.navLink} href="/">
            Home
          </a>
        </div>
      </header>
      <main className={styles.hero}>
        <h1>Hanzi handwriting practice</h1>
        <p className={styles.pitch}>Write Chinese characters in your browser with stroke feedback.</p>
        <a className={styles.cta} href="/app">
          Start practicing
        </a>
      </main>
    </div>
  );
}
