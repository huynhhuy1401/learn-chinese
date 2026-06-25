import { CardState, ReviewRating } from '@prisma/client';
import { scheduleReview, freshCardState, FsrsSchedulingResult } from './fsrs';

const NOW = new Date('2026-01-01T00:00:00Z');

describe('FSRS engine', () => {
  it('promotes NEW → LEARNING/REVIEW on GOOD', () => {
    const r = scheduleReview(freshCardState(), ReviewRating.GOOD, NOW);
    expect(r.state).not.toBe(CardState.NEW);
    expect(r.stability).toBeGreaterThan(0);
    expect(r.difficulty).toBeGreaterThanOrEqual(1);
    expect(r.reps).toBe(1);
    expect(r.lapses).toBe(0);
    expect(r.masteryLevel).toBeGreaterThanOrEqual(1);
  });

  it('AGAIN on NEW → RELEARNING, increments lapses', () => {
    const r = scheduleReview(freshCardState(), ReviewRating.AGAIN, NOW);
    expect(r.state).toBe(CardState.RELEARNING);
    expect(r.lapses).toBe(1);
    expect(r.reps).toBe(0);
  });

  it('hard/easy change difficulty monotonically apart', () => {
    const base = scheduleReview(freshCardState(), ReviewRating.GOOD, NOW);
    const easyNext = scheduleReview(
      { ...freshCardState(), state: CardState.REVIEW, stability: 3, difficulty: 5, reps: 1, lapses: 0, lastReviewedAt: NOW, nextReviewAt: NOW },
      ReviewRating.EASY,
      NOW,
    );
    const hardNext = scheduleReview(
      { ...freshCardState(), state: CardState.REVIEW, stability: 3, difficulty: 5, reps: 1, lapses: 0, lastReviewedAt: NOW, nextReviewAt: NOW },
      ReviewRating.HARD,
      NOW,
    );
    expect(easyNext.difficulty).toBeLessThanOrEqual(hardNext.difficulty);
  });

  it('long run of GOOD grads into GRADUATED state', () => {
    let state = freshCardState();
    let result: FsrsSchedulingResult;
    for (let i = 0; i < 6; i++) {
      result = scheduleReview(state, ReviewRating.GOOD, NOW);
      state = {
        state: result.state,
        stability: result.stability,
        difficulty: result.difficulty,
        reps: result.reps,
        lapses: result.lapses,
        lastReviewedAt: NOW,
        nextReviewAt: result.nextReviewAt,
      };
    }
    expect(result!.state).toBe(CardState.GRADUATED);
    expect(result!.masteryLevel).toBe(5);
  });

  it('a lapse after graduation demotes to RELEARNING and resets reps', () => {
    const matured: any = {
      state: CardState.GRADUATED,
      stability: 30,
      difficulty: 5,
      reps: 5,
      lapses: 0,
      lastReviewedAt: NOW,
      nextReviewAt: NOW,
    };
    const r = scheduleReview(matured, ReviewRating.AGAIN, NOW);
    expect(r.state).toBe(CardState.RELEARNING);
    expect(r.reps).toBe(0);
    expect(r.lapses).toBe(1);
    expect(r.stability).toBeLessThan(matured.stability);
  });

  it('nextReviewAt is strictly in the future after a passing review', () => {
    const r = scheduleReview(freshCardState(), ReviewRating.GOOD, NOW);
    expect(r.nextReviewAt.getTime()).toBeGreaterThan(NOW.getTime());
  });
});