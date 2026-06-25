import { ExerciseStrategy, ExerciseEvalResult, StrategyExercise } from './strategy.types';
import { normalizePinyin } from './pinyin-utils';

/**
 * FILL_BLANK — replace a blank in a sentence with the missing word.
 * Accepts the Chinese character OR pinyin (tone-insensitive). Partial credit if
 * the pinyin matches but character is wrong.
 */
export class FillBlankStrategy implements ExerciseStrategy {
  evaluate(exercise: StrategyExercise, answer: string | Record<string, string>): ExerciseEvalResult {
    const submittedChar = String(answer).trim();
    const canonical = exercise.correctAnswer.trim();

    // options may hold an accepted pinyin in index 0
    let canonicalPinyin = '';
    try {
      const opts = JSON.parse(exercise.options);
      if (Array.isArray(opts) && opts.length > 0) canonicalPinyin = String(opts[0]);
    } catch {}

    const charMatch = submittedChar === canonical;
    const pinyinMatch = Boolean(canonicalPinyin) && normalizePinyin(submittedChar) === normalizePinyin(canonicalPinyin);
    const correct = charMatch || pinyinMatch;

    return {
      correct,
      partialCredit: correct ? 1 : 0,
      correctAnswer: canonical,
      acceptedAnswers: canonicalPinyin ? [canonical, canonicalPinyin] : [canonical],
      feedback: correct ? '✓' : 'Accept either the character or its pinyin.',
    };
  }
}