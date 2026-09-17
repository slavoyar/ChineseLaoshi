import type { ReactNode } from 'react';

import styles from './inner-layout.module.css';
import { SiteBrand } from './site-brand';
import { SiteFooter } from './site-footer';

type InnerLayoutProps = {
  nav: ReactNode;
  before?: ReactNode;
  children: ReactNode;
};

export function InnerLayout({ nav, before, children }: InnerLayoutProps) {
  return (
    <div className={styles.shell}>
      {before}
      <header className={styles.header}>
        <div className={styles.bar}>
          <SiteBrand />
          {nav}
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.article}>{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
