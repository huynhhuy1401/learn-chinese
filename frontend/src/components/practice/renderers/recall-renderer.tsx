'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2 } from 'lucide-react';
import { PronounceButton } from '@/components/pronounce-button';
import type { RenderProps } from '../renderer.types';
import type { ReviewRating } from '@/types/domain';

/**
 * Self-graded recall renderers. Two directions:
 *  - RECALL_MEANING: see Chinese → type/select the English meaning.
 *  - RECALL_READING: see English → type the pinyin (tone-insensitive).
 * Both are self-graded via AGAIN / HARD / GOOD / EASY buttons.
 */
export function RecallMeaningRenderer({ item, onResolve, disabled }: RenderProps) {
  const [input, setInput] = useState('');
  const [revealed, setRevealed] = useState(false);
  const word = item.word;
  const correctAnswer = item.correctAnswer ?? word?.english ?? '';

  const handleShowAnswer = () => {
    setRevealed(true);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <PronounceButton text={word?.character ?? ''} />
        <span className="text-5xl font-bold cn-display">{word?.character}</span>
        <p className="text-sm text-muted-foreground">Type the English meaning</p>
      </div>
      <input
        autoFocus
        type="text"
        value={input}
        disabled={disabled || revealed}
        onChange={(e) => setInput(e.target.value)}
        placeholder="meaning..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim() && !revealed) {
            e.preventDefault();
            handleShowAnswer();
          }
        }}
        className="w-full text-center text-lg font-medium rounded-xl border-2 px-4 py-3 bg-transparent outline-none focus:border-primary/60"
      />
      {!revealed ? (
        <Button
          size="lg"
          className="w-full rounded-2xl h-12"
          disabled={disabled || input.trim().length === 0}
          onClick={handleShowAnswer}
        >
          Show Answer
        </Button>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Correct Meaning</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 cn-display">{correctAnswer}</p>
          </div>
          <SelfGradeButtons
            disabled={disabled}
            onRate={(rating) => onResolve({ answer: input, rating })}
          />
          <p className="text-center text-xs text-muted-foreground">Self-assess: pick the rating that matches your recall</p>
        </div>
      )}
    </div>
  );
}

export function RecallReadingRenderer({ item, onResolve, disabled }: RenderProps) {
  const [input, setInput] = useState('');
  const [revealed, setRevealed] = useState(false);
  const word = item.word;
  const correctAnswer = item.correctAnswer ?? word?.pinyin ?? '';

  const handleShowAnswer = () => {
    setRevealed(true);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl font-bold">{word?.english}</span>
        <p className="text-sm text-muted-foreground">Type the pinyin reading</p>
      </div>
      <input
        autoFocus
        type="text"
        value={input}
        disabled={disabled || revealed}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. ni hao (tones optional)"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim() && !revealed) {
            e.preventDefault();
            handleShowAnswer();
          }
        }}
        className="w-full text-center text-lg font-medium rounded-xl border-2 px-4 py-3 bg-transparent outline-none focus:border-primary/60"
      />
      {!revealed ? (
        <Button
          size="lg"
          className="w-full rounded-2xl h-12"
          disabled={disabled || input.trim().length === 0}
          onClick={handleShowAnswer}
        >
          Show Answer
        </Button>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
            <p className="text-xs text-muted-foreground mb-1">Correct Reading (Pinyin)</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 cn-display">{correctAnswer}</p>
          </div>
          <SelfGradeButtons
            disabled={disabled}
            onRate={(rating) => onResolve({ answer: input, rating })}
          />
          <p className="text-center text-xs text-muted-foreground">Self-assess: pick the rating that matches your recall</p>
        </div>
      )}
    </div>
  );
}

function SelfGradeButtons({
  disabled,
  onRate,
}: {
  disabled: boolean;
  onRate: (r: ReviewRating) => void;
}) {
  const buttons: { label: string; rating: ReviewRating; tone: string }[] = [
    { label: 'Again', rating: 'AGAIN', tone: 'bg-red-500/10 text-red-700 dark:text-red-300' },
    { label: 'Hard', rating: 'HARD', tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
    { label: 'Good', rating: 'GOOD', tone: 'bg-green-500/10 text-green-700 dark:text-green-300' },
    { label: 'Easy', rating: 'EASY', tone: 'bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((b) => (
        <Button
          key={b.rating}
          disabled={disabled}
          variant="outline"
          className={`rounded-xl h-12 font-bold border-2 ${b.tone}`}
          onClick={() => onRate(b.rating)}
        >
          {b.label}
        </Button>
      ))}
    </div>
  );
}