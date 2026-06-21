'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface StrokeOrderProps {
  character: string;
}

export function StrokeOrder({ character }: StrokeOrderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [currentStroke, setCurrentStroke] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    setLoading(true);
    setError(false);

    // Dynamically import hanzi-writer
    import('hanzi-writer').then((HanziWriter) => {
      if (writerRef.current) {
        writerRef.current.hideCharacter();
      }

      const writer = HanziWriter.default.create(containerRef.current!, character, {
        width: 300,
        height: 300,
        padding: 30,
        strokeColor: '#1a1a1a',
        radicalColor: '#404040',
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 500,
        showOutline: true,
        outlineColor: 'rgba(0,0,0,0.08)',
        onLoadCharDataSuccess: (data: any) => {
          setStrokeCount(data.strokes?.length ?? 0);
          setLoading(false);
        },
        onLoadCharDataError: () => {
          setLoading(false);
          setError(true);
        },
      });

      writerRef.current = writer;
    }).catch(() => {
      setLoading(false);
      setError(true);
    });

    return () => {
      if (writerRef.current) {
        writerRef.current.hideCharacter();
      }
    };
  }, [character]);

  const animate = () => {
    writerRef.current?.animateCharacter({
      onComplete: () => setPlaying(false),
    });
    setPlaying(true);
  };

  const pause = () => {
    writerRef.current?.pauseAnimation();
    setPlaying(false);
  };

  const quiz = () => {
    writerRef.current?.quiz({
      onMistake: (data: any) => { setCurrentStroke(data.strokeNum); },
      onCorrectStroke: (data: any) => { setCurrentStroke(data.strokeNum); },
      onComplete: () => setPlaying(false),
    });
    setPlaying(true);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Stroke order data not available for this character.
        <p className="mt-1 text-xs">Try a more common character.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="relative w-[300px] h-[300px] [&>svg]:absolute [&>svg]:inset-0"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {!loading && (
        <>
          <div className="flex justify-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={animate} disabled={playing}>
              <Play className="w-4 h-4 mr-1" /> Animate
            </Button>
            <Button variant="outline" size="sm" onClick={pause} disabled={!playing}>
              <Pause className="w-4 h-4 mr-1" /> Pause
            </Button>
            <Button variant="outline" size="sm" onClick={quiz}>
              <SkipForward className="w-4 h-4 mr-1" /> Quiz Me
            </Button>
          </div>
          {strokeCount > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {strokeCount} strokes · trace each one carefully
            </p>
          )}
        </>
      )}
    </div>
  );
}
