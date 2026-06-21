import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async getSavedWords(userId: string) {
    return this.prisma.savedWord.findMany({
      where: { userId },
      include: { word: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveWord(userId: string, wordId: string) {
    return this.prisma.savedWord.upsert({
      where: { userId_wordId: { userId, wordId } },
      create: { userId, wordId },
      update: {},
      include: { word: true },
    });
  }

  async unsaveWord(userId: string, wordId: string) {
    return this.prisma.savedWord.delete({
      where: { userId_wordId: { userId, wordId } },
    });
  }

  async isSaved(userId: string, wordId: string) {
    const existing = await this.prisma.savedWord.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });
    return !!existing;
  }
}
