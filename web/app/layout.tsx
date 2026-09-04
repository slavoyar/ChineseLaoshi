import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Chinese Laoshi',
  description:
    'Write hanzi in the browser and drill translations with your own flashcards. Free, no app install.',
  icons: { icon: '/assets/icon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var tg=window.Telegram&&window.Telegram.WebApp;if(tg&&tg.initData){location.replace('/app'+location.search+location.hash);}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
