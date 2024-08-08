export const getColorByPercent = (percent: number) => {
  if (percent > 0.5 && percent < 0.75) {
    return 'text-success-200';
  }
  if (percent >= 0.75) {
    return 'text-success-500';
  }
  return 'text-secondary-200';
};
