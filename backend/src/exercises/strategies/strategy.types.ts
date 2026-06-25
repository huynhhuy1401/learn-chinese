import { ExerciseType } from '@prisma/client';

export interface ExerciseEvalResult {
  /// Was the answer accepted as fully correct?
  correct: boolean;
  /// 0..1 partial-credit score (1 = fully correct, 0 = fully wrong).
  partialCredit: number;
  /// Returned to the FE for display.
  correctAnswer: string;
  /// Alternate accepted answers (pinyin variants, etc.) — also for display.
  acceptedAnswers?: string[];
  /// Short per-strategy hint shown after answering.
  feedback?: string;
}

export interface StrategyExercise {
  id: string;
  type: ExerciseType;
  question: string;
  questionLabel: string | null;
  options: string; // JSON array encoded as string
  correctAnswer: string;
}

export interface ExerciseStrategy {
  /// Evaluate a user's answer against this exercise.
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult;
}