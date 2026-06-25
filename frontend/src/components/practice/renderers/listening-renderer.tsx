'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Send } from 'lucide-react';
import { PronounceButton } from '@/components/pronounce-button';
import type { RenderProps } from '../renderer.types';

/**
 * LISTENING — play audio, the user types the Chinese character or pinyin.
 * Tone-insensitive acceptance handled by the backend strategy.
 */
export function ListeningRenderer({ item, onResolve, disabled }: RenderProps) {
  const [input, setInput] = useState('');
  const word = item.word;
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <PronounceButton text={word?.character ?? ''} size="md" />
        <p className="text-sm text-muted-foreground">Listen, then type what you heard</p>
      </div>
      <input
        autoFocus
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Chinese character or pinyin..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) onResolve({ answer: input });
        }}
        className="w-full text-center text-lg font-medium rounded-xl border-2 px-4 py-3 bg-transparent outline-none focus:border-primary/60"
      />
      <Button
        size="lg"
        className="w-full rounded-2xl"
        disabled={disabled || input.trim().length === 0}
        onClick={() => onResolve({ answer: input })}
      >
        Check <Send className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}