import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.province.findMany({
      orderBy: { unlockOrder: 'asc' },
      include: { _count: { select: { vocabulary: true, exercises: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.province.findUnique({
      where: { id },
      include: {
        vocabulary: { orderBy: { category: 'asc' } },
        grammar: true,
        exercises: true,
      },
    });
  }

  async getNextUnlocked(userId: string | null) {
    if (!userId) {
      return this.prisma.province.findFirst({ orderBy: { unlockOrder: 'asc' } });
    }
    const progress = await this.prisma.userProgress.findMany({
      where: { userId, completed: true },
      include: { province: true },
    });
    const maxCompleted = progress.reduce((max, p) =>
      Math.max(max, p.province.unlockOrder), 0);
    return this.prisma.province.findFirst({
      where: { unlockOrder: maxCompleted + 1 },
      orderBy: { unlockOrder: 'asc' },
    });
  }

  /**
   * A province is unlocked if every province with lower unlockOrder is completed
   * by this user (or the user is a guest — guests unlock the first province only).
   */
  async isUnlocked(userId: string | null, provinceId: string): Promise<boolean> {
    const target = await this.prisma.province.findUnique({ where: { id: provinceId } });
    if (!target) return false;
    if (target.unlockOrder === 1) return true;
    if (!userId) return false;
    const earlier = await this.prisma.province.findMany({
      where: { unlockOrder: { lt: target.unlockOrder } },
      select: { id: true },
    });
    if (earlier.length === 0) return true;
    const completed = await this.prisma.userProgress.findMany({
      where: { userId, completed: true, provinceId: { in: earlier.map((p) => p.id) } },
      select: { provinceId: true },
    });
    return completed.length === earlier.length;
  }
}