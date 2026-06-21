import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { ExercisesService } from './exercises.service';
import { Exercise } from './dto/exercise.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ObjectType()
class ExerciseResult {
  @Field()
  correct: boolean;
  @Field()
  correctAnswer: string;
}

@Resolver(() => Exercise)
export class ExercisesResolver {
  constructor(
    private exercisesService: ExercisesService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [Exercise])
  async exercises(
    @Args('provinceId', { type: () => ID }) provinceId: string,
  ) {
    return this.exercisesService.findByProvince(provinceId);
  }

  @Mutation(() => ExerciseResult)
  @UseGuards(SupabaseAuthGuard)
  async submitAnswer(
    @Context() ctx: any,
    @Args('exerciseId') exerciseId: string,
    @Args('answer') answer: string,
    @Args('provinceId', { type: () => ID }) provinceId: string,
  ) {
    const userId = ctx.req.user.id;
    const result = await this.exercisesService.checkAnswer(exerciseId, answer);

    const existing = await this.prisma.userProgress.findUnique({
      where: { userId_provinceId: { userId, provinceId } },
    });

    if (existing) {
      await this.prisma.userProgress.update({
        where: { id: existing.id },
        data: {
          exercisesDone: { increment: 1 },
          score: { increment: result.correct ? 1 : 0 },
          lastStudiedAt: new Date(),
        },
      });
    } else {
      await this.prisma.userProgress.create({
        data: { userId, provinceId, exercisesDone: 1, score: result.correct ? 1 : 0 },
      });
    }

    return result;
  }
}
