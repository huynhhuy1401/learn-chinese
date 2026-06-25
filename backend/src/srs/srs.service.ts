import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ReviewMode,
  ReviewRating,
  CardState,
  Prisma,
  VocabularyWord,
  UserWordProgress,
} from '@prisma/client';
import { scheduleReview, freshCardState } from './fsrs';
import { DueCard, ReviewStats } from './srs.dto';

const DAY_MS = 86_400_000;

@Injectable()
export class SrsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetch due cards for a user, respecting the review mode.
   * Ordered: overdue first (oldest nextReviewAt), then new cards.
   */
  async getDueCards(
    userId: string,
    mode: ReviewMode,
    limit: number,
    provinceId?: string,
  ): Promise<DueCard[]> {
    const now = new Date();
    const due: DueCard[] = [];

    // 1. Review queue: state in [LEARNING, REVIEW, RELEARNING, GRADUATED] and due now or in past.
    const dueWord: Prisma.VocabularyWordWhereInput = {};
    if (mode === ReviewMode.SAVED_ONLY) dueWord.savedBy = { some: { userId } };
    if (provinceId) dueWord.provinceId = provinceId;
    const dueWhere: Prisma.UserWordProgressWhereInput = {
      userId,
      nextReviewAt: { lte: now },
      state: {
        in: [
          CardState.LEARNING,
          CardState.REVIEW,
          CardState.RELEARNING,
          CardState.GRADUATED,
        ],
      },
      ...(Object.keys(dueWord).length > 0 ? { word: dueWord } : {}),
    };

    const overdue = await this.prisma.userWordProgress.findMany({
      where: dueWhere,
      include: {
        word: {
          include: { province: { select: { name: true, color: true } } },
        },
      },
      orderBy: { nextReviewAt: 'asc' },
      take: limit,
    });

    for (const p of overdue) {
      due.push(this.toDueCard(p));
    }

    if (due.length >= limit) return due.slice(0, limit);

    // 2. New words the user has touched (studied in a lesson) but never reviewed.
    // For DAILY / LESSON_POST modes we also surface words from the province that the
    // user has saved OR encountered via lesson-progress (exercisesDone > 0).
    const remaining = limit - due.length;
    const seenWordIds = new Set(due.map((d) => d.wordId));

    const newWord: Prisma.VocabularyWordWhereInput = {};
    if (mode === ReviewMode.SAVED_ONLY) newWord.savedBy = { some: { userId } };
    if (provinceId) newWord.provinceId = provinceId;
    const newWhere: Prisma.UserWordProgressWhereInput = {
      userId,
      state: CardState.NEW,
      ...(Object.keys(newWord).length > 0 ? { word: newWord } : {}),
    };

    const newProgress = await this.prisma.userWordProgress.findMany({
      where: newWhere,
      include: { word: true },
      take: remaining,
      orderBy: { wordId: 'asc' },
    });

    for (const p of newProgress) {
      if (seenWordIds.has(p.wordId)) continue;
      due.push(this.toDueCard(p));
      seenWordIds.add(p.wordId);
    }

    // 3. For LESSON_PRE/LESSON_POST and DAILY: if we still have remaining slots and
    //    the user is scoped to a province, surface untouched words from that province
    //    (ones the user has never seen) so a fresh lesson still has cards to study.
    if (due.length < limit && provinceId) {
      const extraRemaining = limit - due.length;
      const exemptWordIds = new Set(seenWordIds);
      const provinceWords = await this.prisma.vocabularyWord.findMany({
        where: { provinceId, id: { notIn: Array.from(exemptWordIds) } },
        take: extraRemaining,
        orderBy: { category: 'asc' },
      });
      for (const w of provinceWords) {
        due.push({
          wordId: w.id,
          character: w.character,
          pinyin: w.pinyin,
          english: w.english,
          travelSentence: w.travelSentence ?? undefined,
          category: w.category,
          masteryLevel: 0,
          state: CardState.NEW,
        });
        seenWordIds.add(w.id);
      }
    } else if (due.length < limit && mode === ReviewMode.SAVED_ONLY) {
      // Untouched saved words (no progress row yet) — treat as new.
      const extraRemaining = limit - due.length;
      const savedNoProgress = await this.prisma.savedWord.findMany({
        where: { userId, word: { progress: { none: { userId } } } },
        include: { word: true },
        take: extraRemaining,
        orderBy: { createdAt: 'desc' },
      });
      for (const sw of savedNoProgress) {
        if (seenWordIds.has(sw.wordId)) continue;
        due.push(this.toDueCardFromWord(sw.word));
        seenWordIds.add(sw.wordId);
      }
    }

    return due.slice(0, limit);
  }

  async startSession(
    userId: string,
    mode: ReviewMode,
    provinceId?: string,
    limit = 20,
  ) {
    const cards = await this.getDueCards(userId, mode, limit, provinceId);
    const session = await this.prisma.reviewSession.create({
      data: { userId, mode, provinceId: provinceId ?? null },
    });
    return {
      id: session.id,
      mode: session.mode,
      cards,
      totalCards: cards.length,
    };
  }

  async recordReview(
    userId: string,
    sessionId: string,
    wordId: string,
    rating: ReviewRating,
  ) {
    const now = new Date();
    const existing = await this.prisma.userWordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    const prevState = existing
      ? {
          state: existing.state,
          stability: existing.stability,
          difficulty: existing.difficulty,
          reps: existing.reps,
          lapses: existing.lapses,
          lastReviewedAt: existing.lastReviewedAt,
          nextReviewAt: existing.nextReviewAt,
        }
      : freshCardState();

    const result = scheduleReview(prevState, rating, now);
    const correct = rating !== ReviewRating.AGAIN;

    const upserted = await this.prisma.userWordProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      create: {
        userId,
        wordId,
        state: result.state,
        stability: result.stability,
        difficulty: result.difficulty,
        reps: result.reps,
        lapses: result.lapses,
        masteryLevel: result.masteryLevel,
        timesCorrect: correct ? 1 : 0,
        timesWrong: correct ? 0 : 1,
        lastReviewedAt: now,
        nextReviewAt: result.nextReviewAt,
      },
      update: {
        state: result.state,
        stability: result.stability,
        difficulty: result.difficulty,
        reps: result.reps,
        lapses: result.lapses,
        masteryLevel: result.masteryLevel,
        timesCorrect: { increment: correct ? 1 : 0 },
        timesWrong: { increment: correct ? 0 : 1 },
        lastReviewedAt: now,
        nextReviewAt: result.nextReviewAt,
      },
    });

    await this.prisma.reviewSessionItem.create({
      data: { sessionId, wordId, rating, correct, createdAt: now },
    });

    const session = await this.prisma.reviewSession.update({
      where: { id: sessionId },
      data: {
        itemsReviewed: { increment: 1 },
        correctCount: { increment: correct ? 1 : 0 },
      },
    });

    await this.updateStreak(userId, now);

    // Auto-complete the word's province if ≥60% of its words have matured
    // (FSRS state REVIEW or GRADUATED). Idempotent — upserts completed=true.
    await this.maybeAutoCompleteProvince(userId, wordId);

    return {
      wordId,
      masteryLevel: upserted.masteryLevel,
      state: upserted.state,
      nextReviewAt: upserted.nextReviewAt,
      sessionReviewed: session.itemsReviewed,
      sessionCorrect: session.correctCount,
    };
  }

  private async maybeAutoCompleteProvince(userId: string, wordId: string) {
    const word = await this.prisma.vocabularyWord.findUnique({
      where: { id: wordId },
      select: { provinceId: true },
    });
    if (!word) return;
    const province = await this.prisma.province.findUnique({
      where: { id: word.provinceId },
      select: { vocabulary: { select: { id: true } } },
    });
    if (!province || province.vocabulary.length === 0) return;

    const wordIds = province.vocabulary.map((w) => w.id);
    const matured = await this.prisma.userWordProgress.count({
      where: {
        userId,
        wordId: { in: wordIds },
        state: { in: [CardState.REVIEW, CardState.GRADUATED] },
      },
    });
    if (matured / province.vocabulary.length >= 0.6) {
      await this.prisma.userProgress.upsert({
        where: { userId_provinceId: { userId, provinceId: word.provinceId } },
        create: { userId, provinceId: word.provinceId, completed: true, lastStudiedAt: new Date() },
        update: { completed: true, lastStudiedAt: new Date() },
      });
    }
  }

  async endSession(sessionId: string) {
    return this.prisma.reviewSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });
  }

  async getReviewStats(userId: string): Promise<ReviewStats> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const cardsDue = await this.prisma.userWordProgress.count({
      where: {
        userId,
        nextReviewAt: { lte: now },
        state: {
          in: [
            CardState.LEARNING,
            CardState.REVIEW,
            CardState.RELEARNING,
            CardState.GRADUATED,
          ],
        },
      },
    });

    const newCardsToday = await this.prisma.userWordProgress.count({
      where: {
        userId,
        state: CardState.NEW,
        lastReviewedAt: { gte: startOfDay },
      },
    });

    const reviewedToday = await this.prisma.reviewSessionItem.count({
      where: { createdAt: { gte: startOfDay }, session: { userId } },
    });

    const correctToday = await this.prisma.reviewSessionItem.count({
      where: {
        createdAt: { gte: startOfDay },
        correct: true,
        session: { userId },
      },
    });

    const retentionPct =
      reviewedToday > 0 ? Math.round((correctToday / reviewedToday) * 100) : 0;

    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });
    return {
      cardsDue,
      newCardsToday,
      reviewedToday,
      retentionPct,
      streak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
    };
  }

  /**
   * Ensure all words a user has *encountered* (saved or learned in a province)
   * have a UserWordProgress row, so SRS covers all touched words (not just saved).
   * Called lazily from dueCards and lesson-progress flows.
   */
  async ensureProgressForWords(userId: string, wordIds: string[]) {
    if (wordIds.length === 0) return;
    const existing = await this.prisma.userWordProgress.findMany({
      where: { userId, wordId: { in: wordIds } },
      select: { wordId: true },
    });
    const have = new Set(existing.map((e) => e.wordId));
    const missing = wordIds.filter((id) => !have.has(id));
    if (missing.length === 0) return;
    await this.prisma.userWordProgress.createMany({
      data: missing.map((wordId) => ({ userId, wordId, state: CardState.NEW })),
      skipDuplicates: true,
    });
  }

  private async updateStreak(userId: string, now: Date) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let streak = await this.prisma.userStreak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastReviewDate: today,
        },
      });
      return;
    }
    if (!streak.lastReviewDate) {
      await this.prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastReviewDate: today,
        },
      });
      return;
    }
    const last = new Date(streak.lastReviewDate);
    const lastDay = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate(),
    );
    const diffDays = Math.round((today.getTime() - lastDay.getTime()) / DAY_MS);
    if (diffDays === 0) return; // already counted today
    const newCurrent =
      diffDays === 1
        ? streak.currentStreak + 1
        : diffDays > 1
          ? 1
          : streak.currentStreak;
    await this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrent,
        longestStreak: Math.max(newCurrent, streak.longestStreak),
        lastReviewDate: today,
      },
    });
  }

  private toDueCard(p: UserWordProgress & { word: VocabularyWord }): DueCard {
    return {
      wordId: p.wordId,
      character: p.word.character,
      pinyin: p.word.pinyin,
      english: p.word.english,
      travelSentence: p.word.travelSentence ?? undefined,
      category: p.word.category,
      masteryLevel: p.masteryLevel,
      state: p.state,
    };
  }

  private toDueCardFromWord(w: VocabularyWord): DueCard {
    return {
      wordId: w.id,
      character: w.character,
      pinyin: w.pinyin,
      english: w.english,
      travelSentence: w.travelSentence ?? undefined,
      category: w.category,
      masteryLevel: 0,
      state: CardState.NEW,
    };
  }
}
