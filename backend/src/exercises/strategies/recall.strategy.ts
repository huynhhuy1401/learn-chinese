import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';
import { normalizePinyin } from './pinyin-utils';

/**
 * RECALL_MEANING — given Chinese character, recall the English meaning.
 * Accepts the English answer (case-insensitive). Spaces normalized.
 */
export class RecallMeaningStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submitted = String(answer).trim().toLowerCase().replace(/\s+/g, ' ');
    const canonical = exercise.correctAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const correct = submitted === canonical;
    const partial = submitted.length > 0 && canonical.includes(submitted) && submitted.length >= canonical.length * 0.6
      ? 0.5
      : 0;
    return {
      correct,
      partialCredit: correct ? 1 : partial,
      correctAnswer: exercise.correctAnswer,
      acceptedAnswers: [exercise.correctAnswer],
      feedback: correct ? '✓' : 'Try the exact meaning.',
    };
  }
}

/**
 * RECALL_READING — given English, recall the pinyin reading.
 * Tone-insensitive (tone marks optional). Space-agnostic.
 */
export class RecallReadingStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submitted = normalizePinyin(String(answer));
    const canonical = normalizePinyin(exercise.correctAnswer);
    const correct = submitted === canonical;
    const partial = submitted.length > 0 && (canonical.startsWith(submitted) || submitted.startsWith(canonical))
      ? 0.5
      : 0;
    return {
      correct,
      partialCredit: correct ? 1 : partial,
      correctAnswer: exercise.correctAnswer,
      acceptedAnswers: [exercise.correctAnswer],
      feedback: correct ? '✓' : 'Pinyin should match (tones ignored).',
    };
  }
}