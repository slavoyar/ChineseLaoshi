export const getColorByPercent = (percent: number) => {
  if (percent > 0.5 && percent < 0.75) {
    return 'text-green-400';
  }
  if (percent >= 0.75) {
    return 'text-green-500';
  }
  return 'text-muted-foreground';
};
