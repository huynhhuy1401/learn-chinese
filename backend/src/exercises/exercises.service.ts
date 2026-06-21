import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findByProvince(provinceId: string) {
    return this.prisma.exercise.findMany({
      where: { provinceId },
    });
  }

  async checkAnswer(exerciseId: string, answer: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) return { correct: false, correctAnswer: '' };
    const correct = exercise.correctAnswer.toLowerCase() === answer.toLowerCase().trim();
    return { correct, correctAnswer: correct ? answer : exercise.correctAnswer };
  }
}
