const DARK_MEDIA = '(prefers-color-scheme: dark)';

export function applySystemTheme(): void {
  const isDark = window.matchMedia(DARK_MEDIA).matches;
  document.documentElement.classList.toggle('dark', isDark);
}

export function initSystemTheme(): void {
  applySystemTheme();
  window.matchMedia(DARK_MEDIA).addEventListener('change', applySystemTheme);
}

export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}
