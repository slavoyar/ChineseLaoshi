import { Button } from '@shared/ui';
import { CanvasDrawer } from '@zh-keyboard/core';
import { ZhkRecognizer } from '@zh-keyboard/recognizer';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const MODEL_PATH = '/models/handwrite/model.json';
const DICT_PATH = '/models/dict.txt';

type DrawPadProps = {
  onPick: (char: string) => void;
  onUndoChar: () => void;
  canUndo: boolean;
};

export const DrawPad = ({ onPick, onUndoChar, canUndo }: DrawPadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<CanvasDrawer | null>(null);
  const recognizerRef = useRef<ZhkRecognizer | null>(null);
  const recognizingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [candidates, setCandidates] = useState<string[]>([]);

  const recognize = useCallback(async () => {
    const drawer = drawerRef.current;
    const recognizer = recognizerRef.current;
    if (!drawer || !recognizer || recognizingRef.current) {
      return;
    }
    const strokeData = [...drawer.getStrokeData()];
    if (strokeData.length === 0) {
      return;
    }

    recognizingRef.current = true;
    try {
      const results = await recognizer.recognize(strokeData);
      setCandidates(results);
    } catch {
      setCandidates([]);
    } finally {
      recognizingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const recognizer = new ZhkRecognizer({
      modelPath: MODEL_PATH,
      dictPath: DICT_PATH,
      backend: 'cpu',
    });
    recognizerRef.current = recognizer;

    void recognizer
      .initialize({
        onProgress: (value) => {
          if (!cancelled) {
            setProgress(value);
          }
        },
      })
      .then((ok) => {
        if (!cancelled) {
          setReady(ok);
          setLoadError(!ok);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
          setReady(false);
        }
      });

    return () => {
      cancelled = true;
      void recognizer.close();
      recognizerRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      drawerRef.current?.destroy();
      drawerRef.current = new CanvasDrawer(canvas, {
        onDrawEnd: () => {
          void recognize();
        },
        // Keep strokes until the user picks a candidate or clears.
        clearDelay: 60_000,
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      drawerRef.current?.destroy();
      drawerRef.current = null;
    };
  }, [ready, recognize]);

  const clearPad = () => {
    drawerRef.current?.clearCanvas();
    setCandidates([]);
  };

  const handlePick = (char: string) => {
    onPick(char);
    clearPad();
  };

  return (
    <div className='grid gap-2 rounded-md border border-border bg-secondary/40 p-2'>
      <div className='flex min-h-11 flex-wrap gap-1.5' role='listbox' aria-label='Character candidates'>
        {candidates.length === 0 ? (
          <p className='text-sm text-muted-foreground'>Draw a character, then pick a match.</p>
        ) : (
          candidates.map((char) => (
            <Button
              key={char}
              type='button'
              variant='outline'
              size='sm'
              className='min-h-11 min-w-11 px-2 text-lg'
              role='option'
              onClick={() => handlePick(char)}
            >
              {char}
            </Button>
          ))
        )}
      </div>

      <div className='relative h-44 touch-none overflow-hidden rounded-md bg-white sm:h-52'>
        {!ready && !loadError ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-slate-600'>
            <span>Loading handwriting…</span>
            <div className='h-1.5 w-40 overflow-hidden rounded-full bg-slate-200'>
              <div
                className='h-full bg-slate-700 transition-[width]'
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        ) : null}
        {loadError ? (
          <div className='absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-slate-600'>
            Couldn’t load handwriting recognition. Type or paste instead.
          </div>
        ) : (
          <canvas ref={canvasRef} className='size-full' aria-label='Handwriting pad' />
        )}
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outline' size='sm' onClick={clearPad} disabled={!ready}>
          Clear pad
        </Button>
        <Button type='button' variant='outline' size='sm' onClick={onUndoChar} disabled={!canUndo}>
          Undo character
        </Button>
      </div>
    </div>
  );
};
