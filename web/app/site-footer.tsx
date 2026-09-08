import { SiteFooterI18n } from './site-footer-i18n';
import styles from './site-footer.module.css';

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <SiteFooterI18n />
      <span data-i18n="footerCopyright">© {year} Chinese Laoshi</span>
      <span aria-hidden="true">·</span>
      <span className={styles.tagline} data-i18n="footerTagline">
        Free Mandarin flashcards and hanzi handwriting in the browser.
      </span>
      <span className={styles.dotDesktop} aria-hidden="true">
        ·
      </span>
      <a href="/about" className={styles.link} data-i18n="footerAbout">
        About
      </a>
    </footer>
  );
}
