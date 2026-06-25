'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { PronounceButton } from '@/components/pronounce-button';
import type { RenderProps } from '../renderer.types';

/**
 * MCQ renderer — for MULTIPLE_CHOICE and CULTURAL types.
 * The user selects one option. Self-grade rating follows auto: AGAIN/GOOD.
 * Also used for auto-graded RECALL_MEANING when MCQ-shaped.
 */
export function McqRenderer({ item, onResolve, disabled }: RenderProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = item.options ?? [];
  const prompt = item.prompt ?? item.word?.english ?? '';

  return (
    <div className="space-y-4">
      {item.word && (
        <div className="flex items-center justify-center gap-3 mb-2">
          <PronounceButton text={item.word.character} />
          <span className="text-3xl font-bold cn-display">{item.word.character}</span>
        </div>
      )}
      <p className="text-base text-muted-foreground text-center">{prompt}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        {options.map((opt) => {
          const isActive = picked === opt;
          return (
            <Button
              key={opt}
              variant={isActive ? 'default' : 'outline'}
              disabled={disabled}
              className="h-auto py-4 px-4 text-base justify-center rounded-xl border-2 hover:border-primary/40 transition-all font-semibold break-words"
              onClick={() => {
                setPicked(opt);
                onResolve({ answer: opt });
              }}
            >
              {opt.split('(')[0].trim()}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/// Shorthand feedback widget shared by all renderers.
export function Feedback({
  correct,
  correctAnswer,
}: {
  correct: boolean;
  correctAnswer: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${
        correct
          ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300'
          : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
      }`}
    >
      {correct ? (
        <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 text-red-600 shrink-0" />
      )}
      <div>
        <p className="font-bold text-base">{correct ? 'Correct!' : 'Not quite'}</p>
        <p className="text-sm mt-0.5 opacity-90 font-medium">
          Correct: <strong className="cn-display">{correctAnswer}</strong>
        </p>
      </div>
    </div>
  );
}