import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';

/**
 * MATCHING — the FE returns an object mapping left-side keys to choices.
 * `correctAnswer` is a JSON record {"key": "value", ...}. We compare maps.
 */
export class MatchingStrategy implements ExerciseStrategy {
  evaluate(
    exercise: StrategyExercise,
    answer: string | Record<string, string>,
  ): ExerciseEvalResult {
    let submitted: Record<string, string> = {};
    if (typeof answer === 'string') {
      try { submitted = JSON.parse(answer); } catch { submitted = {}; }
    } else {
      submitted = answer;
    }

    let canonical: Record<string, string> = {};
    try { canonical = JSON.parse(exercise.correctAnswer); } catch { canonical = {}; }

    const keys = Object.keys(canonical);
    if (keys.length === 0) {
      return { correct: false, partialCredit: 0, correctAnswer: exercise.correctAnswer };
    }
    let correctCount = 0;
    for (const k of keys) {
      if (String(submitted[k] ?? '').trim().toLowerCase() === String(canonical[k] ?? '').trim().toLowerCase()) {
        correctCount++;
      }
    }
    const partial = correctCount / keys.length;
    const correct = partial === 1;
    return {
      correct,
      partialCredit: partial,
      correctAnswer: exercise.correctAnswer,
      feedback: `${correctCount}/${keys.length} matched`,
    };
  }
}