import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SrsService } from '../srs/srs.service';
import { CardState, ReviewMode, ReviewRating } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private srsService: SrsService,
  ) {}

  async getUserProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      include: { province: true },
    });
  }

  async completeProvince(userId: string, provinceId: string) {
    return this.prisma.userProgress.upsert({
      where: { userId_provinceId: { userId, provinceId } },
      create: {
        userId,
        provinceId,
        completed: true,
        lastStudiedAt: new Date(),
      },
      update: { completed: true, lastStudiedAt: new Date() },
    });
  }

  /**
   * Backward-compatible legacy hook used by the older frontend mutation
   * `reviewWord(correct: Boolean!)`. Maps correct → GOOD, wrong → AGAIN,
   * then schedules via FSRS inside a transient session.
   */
  async reviewWord(userId: string, wordId: string, correct: boolean) {
    const session = await this.prisma.reviewSession.create({
      data: { userId, mode: ReviewMode.DAILY },
    });
    await this.srsService.ensureProgressForWords(userId, [wordId]);
    await this.srsService.recordReview(
      userId,
      session.id,
      wordId,
      correct ? ReviewRating.GOOD : ReviewRating.AGAIN,
    );
    await this.srsService.endSession(session.id);
    return this.prisma.userWordProgress.findUniqueOrThrow({
      where: { userId_wordId: { userId, wordId } },
    });
  }

  async getWordProgresses(userId: string) {
    return this.prisma.userWordProgress.findMany({
      where: { userId },
      include: { word: true },
    });
  }

  /**
   * Auto-complete a province when its words have reached a mastery threshold.
   * Threshold: >=60% of the province's words have FSRS state in [REVIEW, GRADUATED].
   */
  async maybeCompleteProvince(userId: string, provinceId: string) {
    const province = await this.prisma.province.findUnique({
      where: { id: provinceId },
      select: { id: true, vocabulary: { select: { id: true } } },
    });
    if (!province || province.vocabulary.length === 0) return null;

    const wordIds = province.vocabulary.map((w) => w.id);
    const matured = await this.prisma.userWordProgress.count({
      where: {
        userId,
        wordId: { in: wordIds },
        state: { in: [CardState.REVIEW, CardState.GRADUATED] },
      },
    });
    const ratio = matured / province.vocabulary.length;
    if (ratio >= 0.6) {
      return this.prisma.userProgress.upsert({
        where: { userId_provinceId: { userId, provinceId } },
        create: {
          userId,
          provinceId,
          completed: true,
          lastStudiedAt: new Date(),
        },
        update: { completed: true, lastStudiedAt: new Date() },
      });
    }
    return null;
  }
}
