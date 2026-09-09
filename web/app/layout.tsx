import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  metadataBase: new URL('https://chineselaoshi.slavoyar.tech'),
  title: 'Free hanzi practice in your browser',
  description:
    'Write Chinese characters and drill translations with your own flashcards. Free, no app install.',
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/' },
  icons: {
    icon: [
      { url: '/assets/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '192x192' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'Chinese Laoshi',
    locale: 'en_US',
    title: 'Free hanzi practice in your browser',
    description:
      'Write Chinese characters and drill translations with your own flashcards. Free, no app install.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chinese Laoshi — free hanzi practice in your browser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free hanzi practice in your browser',
    description:
      'Write Chinese characters and drill translations with your own flashcards. Free, no app install.',
    images: ['/og-image.png'],
  },
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
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          type="module"
          data-cf-beacon='{"token": "7cb60d452a964f07939a9d6e040b9918"}'
        />
      </body>
    </html>
  );
}
