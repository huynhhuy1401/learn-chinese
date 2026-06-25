import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExerciseStrategyFactory } from './strategies/exercise-strategy.factory';

@Injectable()
export class ExercisesService {
  constructor(
    private prisma: PrismaService,
    private strategyFactory: ExerciseStrategyFactory,
  ) {}

  async findByProvince(provinceId: string) {
    return this.prisma.exercise.findMany({
      where: { provinceId },
    });
  }

  async checkAnswer(exerciseId: string, answer: string | Record<string, string>) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) {
      return { correct: false, partialCredit: 0, correctAnswer: '', wordId: null };
    }
    const result = this.strategyFactory
      .for(exercise.type)
      .evaluate(exercise, answer);
    return {
      correct: result.correct,
      partialCredit: result.partialCredit,
      correctAnswer: result.correctAnswer,
      wordId: exercise.wordId,
    };
  }
}