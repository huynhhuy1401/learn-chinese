import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async findByProvince(provinceId: string) {
    return this.prisma.vocabularyWord.findMany({
      where: { provinceId },
      orderBy: { category: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.vocabularyWord.findMany({
      orderBy: [{ category: 'asc' }, { character: 'asc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.vocabularyWord.findUnique({
      where: { id },
      include: { province: { select: { name: true, color: true } } },
    });
  }
}
