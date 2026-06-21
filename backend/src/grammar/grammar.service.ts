import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GrammarService {
  constructor(private prisma: PrismaService) {}

  async findByProvince(provinceId: string) {
    return this.prisma.grammarPoint.findMany({
      where: { provinceId },
    });
  }

  async findAll() {
    return this.prisma.grammarPoint.findMany();
  }
}
