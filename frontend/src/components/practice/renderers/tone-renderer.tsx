'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PronounceButton } from '@/components/pronounce-button';
import type { RenderProps } from '../renderer.types';

const TONES = [
  { label: '1', name: 'ā High level' },
  { label: '2', name: 'á Rising' },
  { label: '3', name: 'ǎ Falling-rising' },
  { label: '4', name: 'à Falling' },
  { label: '5', name: 'Neutral' },
];

/**
 * TONE — pick the tone of a syllable from a 5-button strip.
 */
export function ToneRenderer({ item, onResolve, disabled }: RenderProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const word = item.word;
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <PronounceButton text={word?.character ?? ''} size="md" />
        <span className="text-3xl font-bold cn-display">{word?.character}</span>
        <p className="text-sm text-muted-foreground">What tone is this syllable?</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {TONES.map((t) => (
          <Button
            key={t.label}
            disabled={disabled}
            variant={picked === t.label ? 'default' : 'outline'}
            className="flex flex-col items-center py-3 rounded-xl border-2"
            onClick={() => {
              setPicked(t.label);
              onResolve({ answer: t.label });
            }}
          >
            <span className="text-2xl font-bold">{t.label}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{t.name.split(' ')[1]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}