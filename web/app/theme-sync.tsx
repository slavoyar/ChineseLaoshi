'use client';

import { useEffect } from 'react';

const DARK_MEDIA = '(prefers-color-scheme: dark)';

function applySystemTheme(): void {
  document.documentElement.classList.toggle('dark', window.matchMedia(DARK_MEDIA).matches);
}

/** Keep `html.dark` in sync with OS theme after first paint (FOUC script handles the initial class). */
export function ThemeSync() {
  useEffect(() => {
    applySystemTheme();
    const media = window.matchMedia(DARK_MEDIA);
    media.addEventListener('change', applySystemTheme);
    return () => media.removeEventListener('change', applySystemTheme);
  }, []);

  return null;
}
