const IDLE_TIMEOUT_MS = 2000;

const prefetchImports = () => {
  void Promise.all([
    import('hanzi-writer'),
    import('@zh-keyboard/recognizer'),
    import('@pages/group-detail'),
    import('@pages/write-practice'),
  ]).catch(() => {
    // Prefetch is best-effort; on-demand imports still load when needed.
  });
};

export const prefetchDeferredChunks = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const ric = window.requestIdleCallback;
  if (typeof ric === 'function') {
    ric(() => prefetchImports(), { timeout: IDLE_TIMEOUT_MS });
    return;
  }

  window.setTimeout(prefetchImports, 1);
};
