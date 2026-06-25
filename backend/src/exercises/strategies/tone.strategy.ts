import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';

/**
 * TONE — identify the tone of a syllable.
 * correctAnswer is one of "1", "2", "3", "4", "5" (5 = neutral).
 * Accept both numeric ("1".."5") and tone-marked answer (we strip marks above).
 */
export class ToneStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submitted = String(answer).trim().replace(/[^1-5]/g, '');
    const canonical = exercise.correctAnswer.trim().replace(/[^1-5]/g, '');
    const correct = submitted === canonical;
    return {
      correct,
      partialCredit: correct ? 1 : 0,
      correctAnswer: canonical,
      feedback: correct ? '✓' : 'Tone number must match.',
    };
  }
}