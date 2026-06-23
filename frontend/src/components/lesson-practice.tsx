'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';

interface Exercise {
  id: string;
  type: string;
  question: string;
  questionLabel?: string | null;
  options: string;
  correctAnswer: string;
}

interface LessonPracticeProps {
  exercises: Exercise[];
  onComplete: (score: number, total: number) => void;
  onSubmitAnswer: (exerciseId: string, answer: string) => Promise<{ correct: boolean; correctAnswer: string }>;
}

export function LessonPractice({ exercises, onComplete, onSubmitAnswer }: LessonPracticeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; correctAnswer: string }>>({});
  const [submitting, setSubmitting] = useState(false);

  const ex = exercises[currentIdx];
  const isLast = currentIdx === exercises.length - 1;
  const allDone = Object.keys(answers).length === exercises.length;

  const handleAnswer = async (answer: string) => {
    if (submitting || answers[ex.id]) return;
    setSubmitting(true);
    const result = await onSubmitAnswer(ex.id, answer);
    setAnswers((prev) => ({ ...prev, [ex.id]: result }));
    setSubmitting(false);
  };

  const handleNext = () => {
    if (isLast) {
      const score = Object.values(answers).filter((a) => a.correct).length;
      onComplete(score, exercises.length);
    } else {
      setCurrentIdx((c) => c + 1);
    }
  };

  const answered = answers[ex.id];
  const options: string[] = JSON.parse(ex.options);
  const score = Object.values(answers).filter((a) => a.correct).length;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${(currentIdx / Math.max(exercises.length, 1)) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {currentIdx + 1}/{exercises.length}
        </span>
      </div>

      {/* Question card */}
      <div className={`border-2 rounded-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 transition-all ${
        answered
          ? answered.correct
            ? 'border-green-400 dark:border-green-700'
            : 'border-red-300 dark:border-red-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        {/* Question number */}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-1">
          Question {currentIdx + 1} of {exercises.length}
        </p>
        {ex.questionLabel && (
          <p className="text-sm text-muted-foreground text-center mb-4">{ex.questionLabel}</p>
        )}

        {/* The question */}
        <p className="text-xl sm:text-2xl font-bold text-center mb-6">{ex.question}</p>

        {/* Options */}
        {!answered ? (
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                disabled={submitting}
                className="h-auto py-4 px-4 text-base justify-center rounded-xl border-2 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all font-semibold"
                onClick={() => handleAnswer(opt)}
              >
                {opt.split('(')[0].trim()}
              </Button>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {/* Feedback */}
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 border ${
              answered.correct
                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300'
                : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300'
            }`}>
              {answered.correct ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              )}
              <div>
                <p className="font-bold text-base">
                  {answered.correct ? 'Correct! 🎉' : 'Not quite'}
                </p>
                <p className="text-sm mt-0.5 opacity-90 font-medium">
                  Correct: <strong className="cn-display">{answered.correctAnswer}</strong>
                </p>
              </div>
            </div>

            {/* Next / Finish button */}
            <Button
              size="lg"
              className="w-full h-14 rounded-2xl text-lg"
              onClick={handleNext}
            >
              {isLast ? (
                <>See Results <Trophy className="w-5 h-5 ml-2" /></>
              ) : (
                <>Next Question <ChevronRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Mini score at bottom */}
      {Object.keys(answers).length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Score so far: {score}/{Object.keys(answers).length}
        </p>
      )}
    </div>
  );
}
