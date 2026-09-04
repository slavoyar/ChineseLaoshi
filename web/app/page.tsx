import { HomeI18n } from './home-i18n';
import styles from './home.module.css';
import { TelegramStudyRedirect } from './telegram-study-redirect';

export default function HomePage() {
  return (
    <div className={styles.root}>
      <TelegramStudyRedirect />
      <HomeI18n />
      <header className={styles.header}>
        <div className={styles.bar}>
          <a className={styles.brand} href="/">
            中国老师
          </a>
          <div className={styles.nav}>
            <a className={styles.navLink} href="/about" data-i18n="about">
              About
            </a>
            <a className={styles.ctaNav} href="/app" data-i18n="cta">
              Start practicing
            </a>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.lead}>
          <p className={styles.stage} aria-hidden="true">
            <span className={styles.heroGlyph}>字</span>
          </p>
          <h1 data-i18n="title">Free hanzi practice in your browser</h1>
          <p className={styles.pitch} data-i18n="pitch">
            Chinese Laoshi (中国老师) helps you write Chinese characters online and drill Mandarin
            translations with custom flashcard decks — free, on phone, tablet, or desktop. No app
            install.
          </p>
          <a className={styles.cta} href="/app" data-i18n="cta">
            Start practicing
          </a>
        </section>

        <div className={styles.band}>
          <div className={styles.wide}>
            <div className={styles.featureGrid}>
              <section className={styles.panel}>
                <h2 data-i18n="handwritingTitle">Hanzi handwriting practice</h2>
                <p data-i18n="handwritingBody">
                  Write Chinese characters in your browser with stroke feedback. Draw with your finger
                  on a phone or tablet, or with a mouse on desktop. Stroke-order feedback is part of
                  handwriting practice — no extra app.
                </p>
              </section>

              <section className={styles.panel}>
                <h2 data-i18n="flashcardsTitle">Mandarin flashcards</h2>
                <p data-i18n="flashcardsBody">
                  Drill Mandarin translations with your own flashcards. Review meanings and strengthen
                  recall with flashcard study modes — character, pinyin, and translation on each card.
                </p>
              </section>
            </div>
          </div>
        </div>

        <section className={styles.modesSection}>
          <div className={styles.wide}>
            <h2 data-i18n="modesTitle">Study modes</h2>
            <p data-i18n="modesIntro">
              Pick handwriting, stroke order, pinyin, translation, or mixed practice for all groups.
            </p>
            <dl className={styles.modes}>
              <div>
                <dt data-i18n="modeWrite">Handwriting</dt>
                <dd data-i18n="modeWriteBody">
                  Write Chinese characters with touch or mouse and get stroke feedback.
                </dd>
              </div>
              <div>
                <dt data-i18n="modeStroke">Stroke order</dt>
                <dd data-i18n="modeStrokeBody">
                  Practice stroke order for characters in your word groups.
                </dd>
              </div>
              <div>
                <dt data-i18n="modePinyin">Pinyin</dt>
                <dd data-i18n="modePinyinBody">Pick the pinyin for the character you are studying.</dd>
              </div>
              <div>
                <dt data-i18n="modeTranslation">Translation</dt>
                <dd data-i18n="modeTranslationBody">
                  Pick the translation and strengthen recall with flashcard drills.
                </dd>
              </div>
              <div>
                <dt data-i18n="modeMixed">Mixed</dt>
                <dd data-i18n="modeMixedBody">
                  Mix handwriting, pinyin, and translation practice in one session.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className={styles.band}>
          <div className={styles.wide}>
            <div className={styles.featureGrid}>
              <section className={styles.panel}>
                <h2 data-i18n="decksTitle">Custom word groups</h2>
                <p data-i18n="decksBody">
                  Build custom word groups with Chinese characters, pinyin, and translations, then
                  study them with handwriting or translation modes. Organize vocabulary into groups,
                  open a group to add words, and study that deck.
                </p>
              </section>

              <section className={styles.panel}>
                <h2 data-i18n="freeTitle">Free, no app install</h2>
                <p data-i18n="freeBody">
                  Chinese Laoshi is completely free, including handwriting practice, translation
                  drills, and custom flashcard decks. It runs in your web browser on phone, tablet, or
                  desktop — no download or app store required.
                </p>
              </section>
            </div>
          </div>
        </div>

        <section className={styles.how}>
          <div className={styles.wide}>
            <h2 data-i18n="howTitle">How it works</h2>
            <ol>
              <li data-i18n="how1">Open the app in your browser and try study modes in demo.</li>
              <li data-i18n="how2">Create word groups with characters, pinyin, and translations.</li>
              <li data-i18n="how3">Practice hanzi handwriting or run translation flashcard drills.</li>
              <li data-i18n="how4">Sign up free to save your vocabulary across devices.</li>
            </ol>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.wide}>
            <h2 data-i18n="faqTitle">FAQ</h2>
            <dl className={styles.faq}>
              <div>
                <dt data-i18n="faqFreeQuestion">Is Chinese Laoshi free?</dt>
                <dd data-i18n="faqFreeAnswer">
                  Yes. Chinese Laoshi is completely free, including handwriting practice, translation
                  drills, and custom flashcard decks.
                </dd>
              </div>
              <div>
                <dt data-i18n="faqInstallQuestion">Do I need to install an app?</dt>
                <dd data-i18n="faqInstallAnswer">
                  No. It runs in your web browser on phone, tablet, or desktop — no download required.
                </dd>
              </div>
              <div>
                <dt data-i18n="faqDecksQuestion">Can I create my own flashcard decks?</dt>
                <dd data-i18n="faqDecksAnswer">
                  Yes. Build custom word groups with Chinese characters, pinyin, and translations, then
                  study them with handwriting or translation modes.
                </dd>
              </div>
              <div>
                <dt data-i18n="faqPhoneQuestion">Does hanzi handwriting practice work on phones?</dt>
                <dd data-i18n="faqPhoneAnswer">
                  Yes. Draw characters with your finger on a phone or tablet, or with a mouse on
                  desktop, and get stroke-order feedback.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.close}>
          <h2 data-i18n="closeTitle">Open the study app</h2>
          <p data-i18n="closeBody">
            Start a handwriting or flashcard session in the browser. Free, no install.
          </p>
          <a className={styles.ctaClose} href="/app" data-i18n="cta">
            Start practicing
          </a>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.bar}>
          <nav className={styles.footerNav} aria-label="Site">
            <a className={styles.navLink} href="/about" data-i18n="about">
              About
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
