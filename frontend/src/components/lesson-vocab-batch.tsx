'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PronounceButton } from '@/components/pronounce-button';
import { CheckCircle2, RotateCcw, Eye, ArrowRight } from 'lucide-react';

interface VocabWord {
  id: string;
  character: string;
  pinyin: string;
  english: string;
  category: string;
  travelSentence?: string | null;
}

interface VocabBatchProps {
  words: VocabWord[];
  batchIndex: number;
  totalBatches: number;
  onComplete: () => void;
  onReviewWord?: (wordId: string, correct: boolean) => void;
}

export function VocabBatch({ words, batchIndex, totalBatches, onComplete, onReviewWord }: VocabBatchProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const word = words[currentIdx];
  const isLast = currentIdx === words.length - 1;
  const allDone = words.length > 0 && results.length === words.length;

  // Keyboard shortcut: Space to reveal, 1/2 to answer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!revealed && !allDone) setRevealed(true);
      }
      if (revealed && e.key === '1') handleResult(true);
      if (revealed && e.key === '2') handleResult(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [revealed, allDone, currentIdx]);

  const handleReveal = useCallback(() => setRevealed(true), []);

  const handleResult = useCallback((gotIt: boolean) => {
    setResults((prev) => [...prev, gotIt]);
    onReviewWord?.(word.id, gotIt);
    if (isLast) {
      setRevealed(false);
    } else {
      setCurrentIdx((c) => c + 1);
      setRevealed(false);
    }
  }, [isLast]);

  if (!word && !allDone) return null;

  // ====== SUMMARY ======
  if (allDone) {
    const gotCount = results.filter(Boolean).length;
    const reviewWords = words.filter((_, i) => !results[i]);

    return (
      <div className="max-w-xl mx-auto">
        <div className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-8 sm:p-10 text-center">
          <p className="text-5xl mb-4">{gotCount === words.length ? '🎉' : '📊'}</p>
          <h3 className="text-2xl font-bold mb-2">
            {gotCount}/{words.length} words learned
          </h3>
          <p className="text-muted-foreground mb-6">
            {gotCount === words.length
              ? 'Perfect! Ready for the next batch.'
              : `${reviewWords.length} word${reviewWords.length > 1 ? 's' : ''} saved for review.`}
          </p>

          {reviewWords.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-6 text-left">
              {reviewWords.map((w) => (
                <div key={w.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-bold cn-display">{w.character}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{w.english}</span>
                </div>
              ))}
            </div>
          )}

          <Button onClick={onComplete} size="lg" className="rounded-2xl px-8 h-12">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====== FLASHCARD ======
  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {words.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < currentIdx
                ? results[i] ? 'w-6 bg-green-400' : 'w-6 bg-amber-400'
                : i === currentIdx
                  ? 'w-8 bg-red-500'
                  : 'w-4 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-2 font-medium">
          {currentIdx + 1}/{words.length}
        </span>
      </div>

      {/* The Card */}
      <div className="rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Question face */}
        <div className="p-8 sm:p-12 text-center">
          {/* Character */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-7xl sm:text-8xl font-bold cn-display select-none leading-none">
              {word.character}
            </span>
            <PronounceButton text={word.character} size="md" />
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            What does this mean?
          </p>

          {/* Reveal button or answer */}
          {!revealed ? (
            <Button
              size="lg"
              onClick={handleReveal}
              className="rounded-2xl px-10 h-14 text-lg bg-red-600 hover:bg-red-700"
            >
              <Eye className="w-5 h-5 mr-2" /> Show Answer
            </Button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Answer */}
              <div className="rounded-2xl bg-[#e8f0fe] dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5 mb-6">
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-1">
                  {word.pinyin}
                </p>
                <p className="text-3xl font-bold mb-3">{word.english}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-white/60 dark:bg-zinc-800/60 text-sm font-medium">
                  {word.category}
                </span>
              </div>

              {/* Travel sentence */}
              {word.travelSentence && (
                <div className="rounded-xl bg-muted/30 p-4 mb-6">
                  <p className="text-lg font-medium cn-display leading-relaxed">
                    {word.travelSentence.split('(')[0]?.trim()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    &ldquo;{word.travelSentence}&rdquo;
                  </p>
                </div>
              )}

              {/* Self-assessment */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl h-14 px-6 border-2 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-base"
                  onClick={() => handleResult(false)}
                >
                  <RotateCcw className="w-5 h-5 mr-2 text-amber-500" /> Review Later
                </Button>
                <Button
                  size="lg"
                  className="rounded-2xl h-14 px-8 text-base bg-green-600 hover:bg-green-700"
                  onClick={() => handleResult(true)}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Got It
                </Button>
              </div>

              {/* Keyboard hints */}
              <p className="text-xs text-muted-foreground mt-3">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[11px] font-mono">1</kbd> for Got It · <kbd className="px-1.5 py-0.5 bg-muted rounded text-[11px] font-mono">2</kbd> for Review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      {!revealed && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 rounded text-[11px] font-mono border">Space</kbd> to reveal
        </p>
      )}
    </div>
  );
}
