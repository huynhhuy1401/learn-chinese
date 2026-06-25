'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Trophy, Flame, RotateCcw } from 'lucide-react';
import type { DueCard, ExerciseItem, ReviewRating, ReviewResult } from '@/types/domain';
import { buildItemFromCard, buildItemFromExercise } from './item-builder';
import type { RenderItemBase, RendererResult } from './renderer.types';
import { McqRenderer, Feedback } from './renderers/mcq-renderer';
import { RecallMeaningRenderer, RecallReadingRenderer } from './renderers/recall-renderer';
import { ListeningRenderer } from './renderers/listening-renderer';
import { ToneRenderer } from './renderers/tone-renderer';
import { WritingRenderer } from './renderers/writing-renderer';
import { FillBlankRenderer } from './renderers/fill-blank-renderer';
import { MatchingRenderer } from './renderers/matching-renderer';
import { PronounceButton } from '@/components/pronounce-button';

export type SessionMode = 'DAILY' | 'SAVED_ONLY' | 'LESSON_PRE' | 'LESSON_POST';

export interface PracticeRunnerProps {
  /// Cached due cards (the caller has already fetched them via useDueCards or
  /// via startReviewSession). The runner reads this list.
  cards: DueCard[];
  /// Sibling cards (same batch) used to build distractors + matching prompts.
  siblings?: DueCard[];
  /// Pre-seeded review session id (from startReviewSession mutation).
  sessionId: string;
  /// Caller-provided mutation that records a review and returns the SRS state.
  onRecordReview: (vars: { sessionId: string; wordId: string; rating: ReviewRating }) => Promise<{ data?: { recordReview: ReviewResult } }>;
  /// Optional graded exercises (lesson post-quiz). When set, the runner uses
  /// these directly and reports via `onSubmitExercise` instead of SRS.
  exercises?: ExerciseItem[];
  /// Submit answers for legacy exercises (lesson quiz).
  onSubmitExercise?: (exerciseId: string, answer: string | Record<string, string>) => Promise<{ correct: boolean; correctAnswer: string; partialCredit: number }>;
  /// Called when the runner finishes the queue with summary stats.
  onComplete: (summary: { total: number; correct: number; again: number }) => void;
  /// Caller-driven "study mode" hint for adaptive selection.
  mode?: SessionMode;
}

interface QueueItem {
  item: RenderItemBase;
  wordId: string;
  /// "card" for SRS-driven items, "exercise" for legacy pre-seeded.
  driver: 'card' | 'exercise';
  exerciseId?: string;
}

export function PracticeRunner({
  cards,
  siblings = [],
  sessionId,
  onRecordReview,
  exercises,
  onSubmitExercise,
  onComplete,
  mode = 'DAILY',
}: PracticeRunnerProps) {
  const queue = useMemo<QueueItem[]>(() => {
    if (exercises && exercises.length > 0) {
      return exercises.map((ex) => ({
        item: buildItemFromExercise(ex),
        wordId: '',
        driver: 'exercise' as const,
        exerciseId: ex.id,
      }));
    }
    return cards.map((c, idx) => ({
      item: buildItemFromCard(c, siblings.length ? siblings : cards, idx),
      wordId: c.wordId,
      driver: 'card' as const,
    }));
  }, [cards, siblings, exercises]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [pending, setPending] = useState<RendererResult | null>(null);
  const [verdict, setVerdict] = useState<{ correct: boolean; correctAnswer: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<QueueItem[]>([]);
  const [doneSummary, setDoneSummary] = useState<{ total: number; correct: number; again: number }>({
    total: 0,
    correct: 0,
    again: 0,
  });

  const item = queue[currentIdx];

  const resolveItem = useCallback(
    async (result: RendererResult) => {
      if (submitting || !item || pending) return;
      setPending(result);
      setSubmitting(true);

      const rating = result.rating ?? (result.answer !== '' ? 'GOOD' : 'AGAIN');

      try {
        if (item.driver === 'card' && sessionId) {
          const res = await onRecordReview({
            sessionId,
            wordId: item.wordId,
            rating,
          });
          const correct = rating !== 'AGAIN';
          setVerdict({ correct, correctAnswer: item.item.correctAnswer ?? '' });
          setDoneSummary((s) => ({
            total: s.total + 1,
            correct: s.correct + (correct ? 1 : 0),
            again: s.again + (correct ? 0 : 1),
          }));
        } else if (item.driver === 'exercise' && onSubmitExercise && item.exerciseId) {
          const answerStr = typeof result.answer === 'string' ? result.answer : JSON.stringify(result.answer);
          const res = await onSubmitExercise(item.exerciseId, answerStr);
          setVerdict({ correct: res.correct, correctAnswer: res.correctAnswer });
          setDoneSummary((s) => ({
            total: s.total + 1,
            correct: s.correct + (res.correct ? 1 : 0),
            again: s.again + (res.correct ? 0 : 1),
          }));
        }
      } finally {
        setSubmitting(false);
        setSummary((prev) => [...prev, item]);
      }
    },
    [item, onRecordReview, onSubmitExercise, pending, submitting, sessionId],
  );

  const next = useCallback(() => {
    if (currentIdx + 1 >= queue.length) {
      onComplete({
        total: queue.length,
        correct: doneSummary.correct,
        again: doneSummary.again,
      });
      return;
    }
    setCurrentIdx((i) => i + 1);
    setPending(null);
    setVerdict(null);
  }, [currentIdx, queue.length, doneSummary, onComplete]);

  // Keyboard shortcuts during practice
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!item) return;
      if (verdict && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        next();
        return;
      }
      // Self-graded rating shortcuts when answer text exists
      if (item.item.type === 'RECALL_MEANING' || item.item.type === 'RECALL_READING') {
        if (e.key === '1') { /* AGAIN emitted by renderer */ }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [item, verdict, next]);

  if (!item) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If we have a verdict, render the feedback + next instead of the input.
  const Renderer = pickRenderer(item.item.type);

  return (
    <div className="space-y-4">
      <ProgressBar current={currentIdx} total={queue.length} correct={doneSummary.correct} />
      <Card className="p-6 sm:p-8 rounded-2xl border-2 border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-1">
          {labelForType(item.item.type)} · card {currentIdx + 1} of {queue.length}
        </p>
        {!verdict ? (
          <Renderer item={item.item} disabled={submitting} onResolve={resolveItem} />
        ) : (
          <div className="space-y-4 max-w-lg mx-auto">
            <Feedback correct={verdict.correct} correctAnswer={verdict.correctAnswer} />
            {item.item.word && (
              <div className="flex items-center justify-center gap-3 py-2">
                <PronounceButton text={item.item.word.character} />
                <span className="text-2xl font-bold cn-display">{item.item.word.character}</span>
                <span className="text-sm text-muted-foreground">{item.item.word.pinyin}</span>
                <span className="text-sm font-medium">— {item.item.word.english}</span>
              </div>
            )}
            <Button size="lg" className="w-full h-14 rounded-2xl text-lg" onClick={next}>
              {currentIdx + 1 >= queue.length ? 'See Results' : 'Next'}
              <Trophy className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
      {item.item.word && !verdict && (
        <p className="text-center text-xs text-muted-foreground">
          Mastery {item.item.word.masteryLevel} · {item.item.word.state}
        </p>
      )}
    </div>
  );
}

function pickRenderer(type: RenderItemBase['type']) {
  switch (type) {
    case 'MULTIPLE_CHOICE':
    case 'CULTURAL':
      return McqRenderer;
    case 'RECALL_MEANING':
      return RecallMeaningRenderer;
    case 'RECALL_READING':
      return RecallReadingRenderer;
    case 'LISTENING':
      return ListeningRenderer;
    case 'TONE':
      return ToneRenderer;
    case 'WRITING':
      return WritingRenderer;
    case 'FILL_BLANK':
      return FillBlankRenderer;
    case 'MATCHING':
      return MatchingRenderer;
    default:
      return McqRenderer;
  }
}

function labelForType(type: RenderItemBase['type']) {
  switch (type) {
    case 'MULTIPLE_CHOICE': return 'Multiple choice';
    case 'RECALL_MEANING': return 'Recall meaning';
    case 'RECALL_READING': return 'Recall reading';
    case 'LISTENING': return 'Listening';
    case 'TONE': return 'Tone recognition';
    case 'WRITING': return 'Writing';
    case 'FILL_BLANK': return 'Fill the blank';
    case 'MATCHING': return 'Matching';
    case 'CULTURAL': return 'Cultural';
    default: return 'Practice';
  }
}

function ProgressBar({ current, total, correct }: { current: number; total: number; correct: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${total === 0 ? 0 : (current / total) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {current + 1}/{total} · <Flame className="w-3.5 h-3.5 inline text-amber-500" /> {correct}✓
      </span>
    </div>
  );
}