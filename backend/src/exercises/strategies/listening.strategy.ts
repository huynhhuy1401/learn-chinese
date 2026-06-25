import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';
import { normalizePinyin, safeParseOptions } from './pinyin-utils';

/**
 * LISTENING — player heard audio (TTS) and types/picks the pinyin or character.
 * Accepts either pinyin (tone-insensitive) or the Chinese characters.
 */
export class ListeningStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submittedRaw = String(answer).trim();
    const canonicalChar = exercise.correctAnswer.trim();
    const canonicalPinyin = safeParseOptions(exercise.options)[0] ?? '';

    const matchChar = submittedRaw === canonicalChar;
    const matchPinyin = normalizePinyin(submittedRaw) === normalizePinyin(canonicalPinyin);
    const correct = matchChar || matchPinyin;
    return {
      correct,
      partialCredit: correct ? 1 : 0,
      correctAnswer: canonicalChar,
      acceptedAnswers: canonicalPinyin ? [canonicalChar, canonicalPinyin] : [canonicalChar],
      feedback: correct ? '✓' : 'Accept the Chinese character or pinyin.',
    };
  }
}