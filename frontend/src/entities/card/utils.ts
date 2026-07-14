export const getColorByPercent = (percent: number) => {
  if (percent > 0.5 && percent < 0.75) {
    return 'text-green-400';
  }
  if (percent >= 0.75) {
    return 'text-green-500';
  }
  return 'text-muted-foreground';
};

export const getProgressStyles = (percent: number) => {
  const percentLabel = Math.round(percent * 100);

  if (percent > 0.5 && percent < 0.75) {
    return {
      border: 'border-green-400',
      line: 'bg-green-400',
      label: 'text-green-600 dark:text-green-400',
      percentLabel,
    };
  }
  if (percent >= 0.75) {
    return {
      border: 'border-green-500',
      line: 'bg-green-500',
      label: 'text-green-600 dark:text-green-400',
      percentLabel,
    };
  }
  return {
    border: 'border-border',
    line: 'bg-border',
    label: 'text-muted-foreground',
    percentLabel,
  };
};
