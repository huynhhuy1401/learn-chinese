'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PronounceButton } from '@/components/pronounce-button';
import { CheckCircle2, RotateCcw, Eye, ArrowRight, Trophy, BarChart3 } from 'lucide-react';

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
        <div className="rounded-3xl border bg-card/85 backdrop-blur-sm p-8 sm:p-10 text-center shadow-lg shadow-red-950/[0.01] animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${gotCount === words.length ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'} animate-bounce`}>
              {gotCount === words.length ? (
                <Trophy className="w-12 h-12" />
              ) : (
                <BarChart3 className="w-12 h-12" />
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {gotCount}/{words.length} words learned
          </h3>
          <p className="text-muted-foreground mb-6 font-light text-sm">
            {gotCount === words.length
              ? 'Perfect! Ready for the next batch.'
              : `${reviewWords.length} word${reviewWords.length > 1 ? 's' : ''} saved for review.`}
          </p>

          {reviewWords.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
              {reviewWords.map((w) => (
                <div key={w.id} className="flex items-center gap-2 p-2.5 bg-muted/40 border rounded-xl card-hover">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-bold cn-display">{w.character}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{w.english}</span>
                </div>
              ))}
            </div>
          )}

          <Button onClick={onComplete} size="lg" className="rounded-2xl px-8 h-12 btn-premium bg-primary text-primary-foreground">
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
      <div className="rounded-3xl border bg-card/85 backdrop-blur-sm shadow-lg shadow-red-950/[0.01] overflow-hidden animate-fade-in">
        {/* Question face */}
        <div className="p-8 sm:p-12 text-center">
          {/* Character */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-7xl sm:text-8xl font-bold cn-display select-none leading-none">
              {word.character}
            </span>
            <PronounceButton text={word.character} size="md" />
          </div>

          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-6">
            What does this mean?
          </p>

          {/* Reveal button or answer */}
          {!revealed ? (
            <Button
              size="lg"
              onClick={handleReveal}
              className="rounded-2xl px-10 h-14 text-base font-semibold bg-primary text-primary-foreground btn-premium"
            >
              <Eye className="w-5 h-5 mr-2" /> Show Answer
            </Button>
          ) : (
            <div className="animate-fade-in">
              {/* Answer */}
              <div className="rounded-2xl bg-secondary/85 dark:bg-zinc-800/40 border p-5 mb-6">
                <p className="text-2xl font-bold text-primary mb-1">
                  {word.pinyin}
                </p>
                <p className="text-3xl font-black tracking-tight mb-3">{word.english}</p>
                <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-0.5">
                  {word.category}
                </Badge>
              </div>

              {/* Travel sentence */}
              {word.travelSentence && (
                <div className="rounded-2xl bg-muted/40 border p-4 mb-6 text-left">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">Travel context</p>
                  <p className="text-lg font-bold cn-display leading-normal">
                    {word.travelSentence.split('(')[0]?.trim()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 italic font-light">
                    &ldquo;{word.travelSentence}&rdquo;
                  </p>
                </div>
              )}

              {/* Self-assessment */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl h-14 px-6 border-2 border-amber-300 dark:border-amber-950 hover:bg-amber-500/10 font-semibold text-base"
                  onClick={() => handleResult(false)}
                >
                  <RotateCcw className="w-5 h-5 mr-2 text-amber-500" /> Review Later
                </Button>
                <Button
                  size="lg"
                  className="rounded-2xl h-14 px-8 text-base bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-500/15"
                  onClick={() => handleResult(true)}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Got It
                </Button>
              </div>

              {/* Keyboard hints */}
              <p className="text-xs text-muted-foreground mt-4 font-light">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">1</kbd> for Got It · <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">2</kbd> for Review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hint */}
      {!revealed && (
        <p className="text-center text-xs text-muted-foreground mt-6 font-light">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[11px] font-mono border">Space</kbd> to reveal
        </p>
      )}
    </div>
  );
}
