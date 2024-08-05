// eslint-disable-next-line import/prefer-default-export
export const getPercentFromRatio = (num: number): number => Math.round(num * 100);

export const cn = (...params: string[]): string => params.join(' ');
