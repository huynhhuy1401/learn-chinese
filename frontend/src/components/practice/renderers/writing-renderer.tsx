'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { RenderProps } from '../renderer.types';
import type { ReviewRating } from '@/types/domain';

/**
 * WRITING — uses hanzi-writer quiz mode for self-graded stroke practice.
 * The renderer reports correct="1" / incorrect="0" + AGAIN/GOOD for FSRS.
 */
export function WritingRenderer({ item, onResolve, disabled }: RenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const { resolvedTheme } = useTheme();
  const character = item.word?.character ?? '';

  useEffect(() => {
    if (!containerRef.current || !character) return;
    setLoading(true);
    setFailed(false);
    setMistakes(0);
    const isDark = resolvedTheme === 'dark';
    import('hanzi-writer').then((HanziWriter) => {
      if (writerRef.current) writerRef.current.hideCharacter();
      try {
        const writer = HanziWriter.default.create(containerRef.current!, character, {
          width: 240,
          height: 240,
          padding: 20,
          strokeColor: isDark ? '#f5f5f4' : '#1c1917',
          radicalColor: isDark ? '#f87171' : '#dc2626',
          outlineColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          showOutline: true,
          onLoadCharDataSuccess: () => setLoading(false),
          onLoadCharDataError: () => { setLoading(false); setFailed(true); },
        });
        writerRef.current = writer;
        writer.quiz({
          onMistake: () => setMistakes((m) => m + 1),
          onComplete: (summary: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const totalMistakes = summary?.totalMistakes ?? 0;
            const rating: ReviewRating = totalMistakes === 0 ? 'EASY' : totalMistakes <= 2 ? 'GOOD' : 'HARD';
            if (totalMistakes > 4) {
              onResolve({ answer: 'incorrect', rating: 'AGAIN' });
            } else {
              onResolve({ answer: 'correct', rating });
            }
          },
        });
      } catch {
        setLoading(false);
        setFailed(true);
      }
    }).catch(() => { setLoading(false); setFailed(true); });

    return () => {
      if (writerRef.current) writerRef.current.hideCharacter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, resolvedTheme]);

  if (failed) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8 space-y-3">
        <p>Stroke data unavailable for <span className="cn-display font-bold">{character}</span>.</p>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => onResolve({ answer: 'correct', rating: 'GOOD' })}
        >
          Mark as practised
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center">Trace the strokes — {character}</p>
      <div className="flex justify-center">
        <div className="relative w-[240px] h-[240px] [&>svg]:absolute [&>svg]:inset-0" ref={containerRef}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      {mistakes > 0 && (
        <p className="text-center text-xs text-muted-foreground">strokes retraced: {mistakes}</p>
      )}
    </div>
  );
}