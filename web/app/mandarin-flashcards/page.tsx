import type { Metadata } from 'next';

import styles from '../home.module.css';
import { TelegramStudyRedirect } from '../telegram-study-redirect';

export const metadata: Metadata = {
  title: 'Mandarin flashcards — Chinese Laoshi',
  description: 'Drill Mandarin translations with your own flashcards. Free, no app install.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/mandarin-flashcards' },
};

export default function MandarinFlashcardsPage() {
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
        <h1>Mandarin flashcards</h1>
        <p className={styles.pitch}>Drill Mandarin translations with your own flashcards.</p>
        <a className={styles.cta} href="/app">
          Start practicing
        </a>
      </main>
    </div>
  );
}
