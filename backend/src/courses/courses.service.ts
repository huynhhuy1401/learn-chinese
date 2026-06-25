import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: { _count: { select: { provinces: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        provinces: {
          orderBy: { unlockOrder: 'asc' },
          include: {
            _count: { select: { vocabulary: true, exercises: true } },
          },
        },
      },
    });
  }
}
