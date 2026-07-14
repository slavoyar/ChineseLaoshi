import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getPercentFromRatio = (num: number): number => Math.round(num * 100);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
