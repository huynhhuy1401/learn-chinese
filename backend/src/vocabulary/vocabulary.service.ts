import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async findByProvince(provinceId: string) {
    return this.prisma.vocabularyWord.findMany({
      where: { provinceId },
      orderBy: { category: 'asc' },
      include: { province: { select: { name: true, color: true } } },
    });
  }

  async findAll() {
    return this.prisma.vocabularyWord.findMany({
      orderBy: [{ category: 'asc' }, { character: 'asc' }],
      include: { province: { select: { name: true, color: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.vocabularyWord.findUnique({
      where: { id },
      include: { province: { select: { name: true, color: true } } },
    });
  }

  /**
   * Bulk-resolve per-user SRS state + saved flag for a batch of word ids.
   * Returns a map keyed by wordId for cheap lookup in field resolvers.
   */
  async resolveUserStateBatch(
    userId: string | null,
    wordIds: string[],
  ): Promise<Map<string, { mastery: number; state: any; isDue: boolean; isSaved: boolean }>> {
    const out = new Map<string, { mastery: number; state: any; isDue: boolean; isSaved: boolean }>();
    if (!userId || wordIds.length === 0) return out;

    const [progress, saved] = await Promise.all([
      this.prisma.userWordProgress.findMany({
        where: { userId, wordId: { in: wordIds } },
        select: { wordId: true, masteryLevel: true, state: true, nextReviewAt: true },
      }),
      this.prisma.savedWord.findMany({
        where: { userId, wordId: { in: wordIds } },
        select: { wordId: true },
      }),
    ]);
    const now = new Date();
    const savedSet = new Set(saved.map((s) => s.wordId));
    for (const p of progress) {
      out.set(p.wordId, {
        mastery: p.masteryLevel,
        state: p.state,
        isDue: p.nextReviewAt.getTime() <= now.getTime(),
        isSaved: savedSet.has(p.wordId),
      });
    }
    // Mark saved words that have no progress row as isSaved=true.
    for (const id of savedSet) {
      if (!out.has(id)) {
        out.set(id, { mastery: 0, state: 'NEW' as any, isDue: false, isSaved: true });
      }
    }
    return out;
  }
}