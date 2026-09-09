const DARK_MEDIA = '(prefers-color-scheme: dark)';

type ThemeListener = () => void;
const themeListeners = new Set<ThemeListener>();

export function subscribeThemeChange(listener: ThemeListener): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function notifyThemeChange(): void {
  themeListeners.forEach((listener) => listener());
}

export function applySystemTheme(): void {
  const isDark = window.matchMedia(DARK_MEDIA).matches;
  document.documentElement.classList.toggle('dark', isDark);
  notifyThemeChange();
}

export function initSystemTheme(): void {
  applySystemTheme();
  window.matchMedia(DARK_MEDIA).addEventListener('change', applySystemTheme);
}

export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}
