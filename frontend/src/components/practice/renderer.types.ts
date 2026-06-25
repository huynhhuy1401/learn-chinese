import type { ExerciseType, ReviewRating } from '@/types/domain';
import type { DueCard } from '@/types/domain';

export type RatingPayload = ReviewRating;

export interface RenderItemBase {
  type: ExerciseType;
  /// The word this item tests (used by audio/canvas renderers).
  word?: DueCard;
  /// Distractor word content for multiple-choice exercises; null for non-MC types.
  options?: string[];
  /// Display prompt override (e.g. fill_blank question text)
  prompt?: string;
  /// Accepted answers (for recall exercises built from the word).
  correctAnswer?: string;
  /// Per-exercise id from the DB (legacy exercises pass this); for auto items, ''.
  exerciseId?: string;
}

export interface RendererResult {
  /// The user's chosen/typed answer (raw) to send to the grader.
  answer: string | Record<string, string>;
  /// FSRS rating chosen by the user (for self-graded items) or undefined to mean "derivable by grader".
  rating?: ReviewRating;
}

export interface RenderProps {
  item: RenderItemBase;
  /// Called when the item is submitted with an answer + optional explicit rating.
  onResolve: (result: RendererResult) => void;
  /// Whether this renderer is currently disabled (e.g. already resolved).
  disabled: boolean;
}