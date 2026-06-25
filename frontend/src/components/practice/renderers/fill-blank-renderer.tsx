'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { RenderProps } from '../renderer.types';

/**
 * FILL_BLANK — type the missing word in a sentence.
 * The `prompt` should already contain a __________ placeholder.
 */
export function FillBlankRenderer({ item, onResolve, disabled }: RenderProps) {
  const [input, setInput] = useState('');
  const word = item.word;
  const prompt = item.prompt ?? '';

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <p className="text-lg text-center leading-relaxed">
        {prompt}
      </p>
      {word && <p className="text-xs text-muted-foreground text-center">Answer with the character or pinyin</p>}
      <input
        autoFocus
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder="fill in the blank..."
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