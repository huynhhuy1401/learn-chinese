import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';

/**
 * CULTURAL — knowledge MCQ about the province's culture; behaves like MCQ.
 */
export class CulturalStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submitted = String(answer).trim();
    const canonical = exercise.correctAnswer.trim();
    const correct = submitted.toLowerCase() === canonical.toLowerCase();
    return {
      correct,
      partialCredit: correct ? 1 : 0,
      correctAnswer: canonical,
      feedback: correct ? '✓' : '✗',
    };
  }
}