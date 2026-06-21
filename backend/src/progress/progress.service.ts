import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      include: { province: true },
    });
  }

  async completeProvince(userId: string, provinceId: string) {
    return this.prisma.userProgress.upsert({
      where: { userId_provinceId: { userId, provinceId } },
      create: { userId, provinceId, completed: true, lastStudiedAt: new Date() },
      update: { completed: true, lastStudiedAt: new Date() },
    });
  }

  async reviewWord(userId: string, wordId: string, correct: boolean) {
    const existing = await this.prisma.userWordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    const newMastery = correct
      ? Math.min(5, (existing?.masteryLevel ?? 0) + 1)
      : Math.max(0, (existing?.masteryLevel ?? 0) - 1);

    const intervals = [1, 1, 3, 7, 14, 30];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervals[newMastery]);

    return this.prisma.userWordProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      create: {
        userId, wordId,
        masteryLevel: newMastery,
        timesCorrect: correct ? 1 : 0,
        timesWrong: correct ? 0 : 1,
        nextReviewAt: nextReview,
      },
      update: {
        masteryLevel: newMastery,
        timesCorrect: correct ? { increment: 1 } : existing?.timesCorrect ?? 0,
        timesWrong: correct ? existing?.timesWrong ?? 0 : { increment: 1 },
        nextReviewAt: nextReview,
        lastReviewedAt: new Date(),
      },
    });
  }

  async getWordProgresses(userId: string) {
    return this.prisma.userWordProgress.findMany({
      where: { userId },
      include: { word: true },
    });
  }
}
