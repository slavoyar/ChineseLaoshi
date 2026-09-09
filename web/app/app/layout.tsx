import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Hanzi Practice in Your Browser — Chinese Laoshi',
  description:
    'Write hanzi in the browser and drill translations with your own flashcards. Free, no app install — start practicing Mandarin in seconds.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://chineselaoshi.slavoyar.tech/app' },
  openGraph: {
    type: 'website',
    siteName: 'Chinese Laoshi',
    locale: 'en_US',
    url: 'https://chineselaoshi.slavoyar.tech/app',
    title: 'Free Hanzi Practice in Your Browser — Chinese Laoshi',
    description:
      'Write hanzi in the browser and drill translations with your own flashcards. Free, no app install — start practicing Mandarin in seconds.',
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
    title: 'Free Hanzi Practice in Your Browser — Chinese Laoshi',
    description:
      'Write hanzi in the browser and drill translations with your own flashcards. Free, no app install.',
    images: ['/og-image.png'],
  },
};

export default function StudyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script src='https://telegram.org/js/telegram-web-app.js' strategy='beforeInteractive' />
      {children}
    </>
  );
}
