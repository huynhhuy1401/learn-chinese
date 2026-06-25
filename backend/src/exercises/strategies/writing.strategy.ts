import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';

/**
 * WRITING — hanzi-writer quiz mode; the FE sends "correct" | "incorrect" based on
 * its own stroke-by-stroke quiz verdict. We trust that verdict but normalize names.
 */
export class WritingStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submitted = String(answer).trim().toLowerCase();
    const correct = submitted === 'correct' || submitted === 'true' || submitted === '1';
    return {
      correct,
      partialCredit: correct ? 1 : 0,
      correctAnswer: exercise.correctAnswer,
      feedback: correct ? '✓' : 'Try tracing the strokes again.',
    };
  }
}