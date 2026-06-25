import { CardState, ReviewRating } from '@prisma/client';

/**
 * FSRS-5 derived scheduling parameters.
 * Based on the Free Spaced Repetition Scheduler by Jarrett Ye.
 * https://github.com/open-spaced-repetition/fsrs4anki/wiki
 */

export interface FsrsCardState {
  state: CardState;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  lastReviewedAt: Date | null;
  nextReviewAt: Date;
}

export interface FsrsSchedulingResult {
  state: CardState;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  nextReviewAt: Date;
  elapsedDays: number;
  /// Display mastery (0..5), derived from state + stability.
  masteryLevel: number;
}

// FSRS-5 default parameters (w array, 19 values): requestRetention, maxInterval.
const REQUEST_RETENTION = 0.9;
const MAX_INTERVAL = 365;
const FACTOR = 19 / 81;
const DECAY = -0.5;

// Default weights (FSRS-5 2024-08). Used to derive initial stability/difficulty.
const W = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
  0.09, 2.42, 0.24, 2.9, 0.3, 0.58,
];

function ratingToValue(rating: ReviewRating): number {
  // AGAIN=1, HARD=2, GOOD=3, EASY=4
  switch (rating) {
    case ReviewRating.AGAIN:
      return 1;
    case ReviewRating.HARD:
      return 2;
    case ReviewRating.GOOD:
      return 3;
    case ReviewRating.EASY:
      return 4;
  }
}

function stateToValue(state: CardState): number {
  // NEW=0, LEARNING=1, REVIEW=2, RELEARNING=3, GRADUATED=4
  switch (state) {
    case CardState.NEW:
      return 0;
    case CardState.LEARNING:
      return 1;
    case CardState.REVIEW:
      return 2;
    case CardState.RELEARNING:
      return 3;
    case CardState.GRADUATED:
      return 4;
  }
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

function initDifficulty(ratingValue: number): number {
  // FSRS init difficulty: w4..w7 influence by rating
  const r = ratingValue - 1; // 0..3
  const d = W[4] - (W[5] * r) / 4 + (W[6] * Math.max(W[7], W[8]) * (1 - r)) / 4;
  return clamp(d, 1, 10);
}

function initStability(ratingValue: number): number {
  // FSRS initial stability for first encounter, based on rating bucket.
  switch (ratingValue) {
    case 1:
      return W[0];
    case 2:
      return W[1];
    case 3:
      return W[2];
    case 4:
      return W[3];
    default:
      return W[2];
  }
}

function nextDifficulty(d: number, r: ReviewRating): number {
  // Mean reversion towards 5 ("forgot" pulls harder).
  const ratingValue = ratingToValue(r);
  const meanDelta = (W[17] - d) * (ratingValue === 1 ? W[15] : W[14]);
  const newD = d + W[13] * meanDelta;
  return clamp(newD, 1, 10);
}

function nextStabilityReview(
  d: number,
  s: number,
  r: ReviewRating,
  ratingValue: number,
): number {
  const hardPenalty = ratingValue === 2 ? W[15] : 1;
  const easyBonus = ratingValue === 4 ? W[16] : 1;
  const difficultyFactor = Math.pow(d, -W[18]);
  return (
    s * (Math.exp(W[9]) * (11 - d) * hardPenalty * easyBonus * difficultyFactor)
  );
}

function nextStabilityAfterLapse(s: number, d: number): number {
  // Relearning stability: short relative to prior.
  return Math.max(W[11] / Math.sqrt(d), 0.5);
}

function nextInterval(stability: number): number {
  // Interval that yields ~REQUEST_RETENTION recall at given stability.
  // R(t) = (1 + FACTOR * t / s) ** DECAY  => solve for t at R = REQUEST_RETENTION.
  const lnR = Math.log(REQUEST_RETENTION);
  const sFactor = (Math.pow(stability, -DECAY) * lnR) / FACTOR;
  const t = Math.pow(-sFactor / lnR, 1 / DECAY) / Math.pow(-lnR, 1 / DECAY);
  const tClampedRaw = Math.max(1, t);
  return Math.min(MAX_INTERVAL, Math.round(tClampedRaw));
}

/**
 * Core FSRS step. Given previous card state + rating + now, returns next state.
 * Pure function — no I/O. Unit-testable.
 */
export function scheduleReview(
  prev: FsrsCardState,
  rating: ReviewRating,
  now: Date,
): FsrsSchedulingResult {
  const ratingValue = ratingToValue(rating);
  const stateValue = stateToValue(prev.state);
  const isPass = rating !== ReviewRating.AGAIN;

  // Elapsed days since last review (0 for NEW/just-started).
  const elapsedDays =
    prev.lastReviewedAt && stateValue >= 2
      ? Math.max(
          0,
          (now.getTime() - prev.lastReviewedAt.getTime()) / 86_400_000,
        )
      : 0;

  let newState: CardState;
  let newStability: number;
  let newDifficulty: number;
  let newReps: number;
  let newLapses: number;

  if (stateValue === 0) {
    // NEW card
    newDifficulty = initDifficulty(ratingValue);
    newStability = initStability(ratingValue);
    newReps = isPass ? 1 : 0;
    newLapses = isPass ? 0 : 1;
    newState = isPass ? CardState.LEARNING : CardState.RELEARNING;
    // First GOOD/EASY can graduate immediately for stability >= short threshold.
    if (isPass && ratingValue >= 3 && newStability >= 1) {
      newState = CardState.REVIEW;
    }
  } else if (stateValue === 1 || stateValue === 3) {
    // LEARNING or RELEARNING — short-step by passing rating.
    newDifficulty = nextDifficulty(prev.difficulty, rating);
    if (isPass) {
      // Graduate to REVIEW (or stay LEARNING if AGAIN previously kept nextReview 0).
      newState = CardState.REVIEW;
      newStability = nextStabilityReview(
        prev.difficulty,
        Math.max(prev.stability, 0.5),
        rating,
        ratingValue,
      );
      newReps = prev.reps + 1;
      newLapses = prev.lapses;
    } else {
      newState = CardState.RELEARNING;
      newStability = nextStabilityAfterLapse(prev.stability, prev.difficulty);
      newReps = 0;
      newLapses = prev.lapses + 1;
    }
  } else {
    // REVIEW (2) or GRADUATED (4)
    newDifficulty = nextDifficulty(prev.difficulty, rating);
    if (isPass) {
      newStability = nextStabilityReview(
        prev.difficulty,
        prev.stability,
        rating,
        ratingValue,
      );
      newReps = prev.reps + 1;
      newLapses = prev.lapses;
      newState = CardState.REVIEW;
      if (newReps >= 3 && newStability >= 7) newState = CardState.GRADUATED;
    } else {
      // Lapse
      newStability = nextStabilityAfterLapse(prev.stability, prev.difficulty);
      newReps = 0;
      newLapses = prev.lapses + 1;
      newState = CardState.RELEARNING;
    }
  }

  const intervalDays =
    newState === CardState.RELEARNING
      ? Math.max(1, Math.round(0.2 * nextInterval(Math.max(newStability, 0.4))))
      : nextInterval(newStability);

  const nextReviewAt = new Date(now.getTime() + intervalDays * 86_400_000);
  const masteryLevel = deriveMasteryLevel(newState, newStability, newReps);

  return {
    state: newState,
    stability: newStability,
    difficulty: newDifficulty,
    reps: newReps,
    lapses: newLapses,
    nextReviewAt,
    elapsedDays,
    masteryLevel,
  };
}

function deriveMasteryLevel(
  state: CardState,
  stability: number,
  reps: number,
): number {
  // Map FSRS state + stability to the legacy 0..5 mastery display.
  switch (state) {
    case CardState.NEW:
      return 0;
    case CardState.LEARNING:
      return 1;
    case CardState.RELEARNING:
      return Math.max(1, 3 - Math.min(2, reps));
    case CardState.REVIEW:
      if (stability < 2) return 2;
      if (stability < 7) return 3;
      return 4;
    case CardState.GRADUATED:
      return 5;
    default:
      return 0;
  }
}

/**
 * Fitness entry for a brand-new card (no prior state).
 */
export function freshCardState(): FsrsCardState {
  const now = new Date();
  return {
    state: CardState.NEW,
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    lastReviewedAt: null,
    nextReviewAt: now,
  };
}
