import type { CardState, ExerciseType, ReviewRating } from '@/types/domain';

/**
 * Pick the exercise/test type appropriate for a word's FSRS state.
 *
 * NEW → recognition MCQ (low effort)
 * LEARNING → recognition MCQ; if already recognised twice, recall-meaning
 * RELEARNING → recall_reading (pinyin) so we re-establish phonology
 * REVIEW → rotate among LISTENING, TONE, FILL_BLANK to keep encoding varied
 * GRADUATED → recall_reading + recall_meaning, sometimes WRITING
 */
export function pickItemType(state: CardState, reps: number, rotation: number): ExerciseType {
  switch (state) {
    case 'NEW':
      return 'MULTIPLE_CHOICE';
    case 'LEARNING':
      return reps >= 2 ? 'RECALL_MEANING' : 'MULTIPLE_CHOICE';
    case 'RELEARNING':
      return 'RECALL_READING';
    case 'REVIEW': {
      const rotationTypes: ExerciseType[] = ['LISTENING', 'TONE', 'FILL_BLANK'];
      return rotationTypes[rotation % rotationTypes.length];
    }
    case 'GRADUATED': {
      const rotationTypes: ExerciseType[] = ['RECALL_READING', 'RECALL_MEANING', 'WRITING', 'LISTENING'];
      return rotationTypes[rotation % rotationTypes.length];
    }
    default:
      return 'MULTIPLE_CHOICE';
  }
}

/**
 * Map an auto-graded exercise correctness to a 4-level FSRS rating.
 * When an item is auto-graded we can only speak in AGAIN / GOOD reliably; HARD
 * is reserved for self-graded Recall/Writing flows (the renderer passes HARD
 * explicitly if the user hesitated).
 */
export function autoRating(correct: boolean): ReviewRating {
  return correct ? 'GOOD' : 'AGAIN';
}

/**
 * Random distractors for auto-generated multiple-choice exercises built from a
 * batch of sibling words.
 */
export function pickDistractors<T>(items: T[], correct: T, count: number): T[] {
  const rest = items.filter((x) => x !== correct);
  const shuffled = [...rest].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}