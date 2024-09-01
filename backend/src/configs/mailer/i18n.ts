import { readFileSync } from 'fs';
import { resolve } from 'path';

const POSSIBLE_LOCALES = ['ru', 'en'];

export const loadTranslations = (path: string, locale: string = 'en') => {
  const _locale = POSSIBLE_LOCALES.includes(locale) ? locale : 'en';
  const filePath = resolve(path, `locales/${_locale}.json`);
  const file = readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
};
