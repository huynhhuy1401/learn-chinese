import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.province.findMany({
      orderBy: { unlockOrder: 'asc' },
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
      // Not logged in — return first province
      return this.prisma.province.findFirst({ orderBy: { unlockOrder: 'asc' } });
    }

    // Find the highest completed unlockOrder
    const progress = await this.prisma.userProgress.findMany({
      where: { userId, completed: true },
      include: { province: true },
    });

    const maxCompleted = progress.reduce((max, p) =>
      Math.max(max, p.province.unlockOrder), 0);

    // Return the next province (or first if none completed)
    return this.prisma.province.findFirst({
      where: { unlockOrder: maxCompleted + 1 },
      orderBy: { unlockOrder: 'asc' },
    });
  }
}
