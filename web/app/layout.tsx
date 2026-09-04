import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';
import { ThemeSync } from './theme-sync';

const themeInitScript = `(function(){var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)document.documentElement.classList.add('dark');})();`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  title: 'Free hanzi practice in your browser',
  description:
    'Write Chinese characters and drill translations with your own flashcards. Free, no app install.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/' },
  icons: { icon: '/assets/icon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
