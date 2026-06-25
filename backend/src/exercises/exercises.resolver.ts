import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Min, Max, MinLength } from 'class-validator';
import { ExercisesService } from './exercises.service';
import { Exercise, ExerciseResult } from './dto/exercise.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { SrsService } from '../srs/srs.service';
import { ReviewMode, ReviewRating } from '@prisma/client';

@InputType()
export class SubmitAnswerInput {
  @Field()
  @IsString()
  @MinLength(1)
  exerciseId: string;

  @Field()
  @IsString()
  answer: string; // JSON-encoded for MATCHING; plain scalar otherwise.

  @Field(() => ID)
  @IsString()
  provinceId: string;
}

@Resolver(() => Exercise)
export class ExercisesResolver {
  constructor(
    private exercisesService: ExercisesService,
    private srsService: SrsService,
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
    @Args('input') input: SubmitAnswerInput,
  ): Promise<ExerciseResult> {
    const userId = ctx.req.user.id;
    // Accept both plain scalars and JSON maps (MATCHING). Parse only if object-like.
    let parsedAnswer: string | Record<string, string> = input.answer;
    const trimmed = input.answer.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const maybe = JSON.parse(trimmed);
        if (maybe && typeof maybe === 'object' && !Array.isArray(maybe)) {
          parsedAnswer = maybe as Record<string, string>;
        }
      } catch {
        // fall back to raw string
      }
    }

    const result = await this.exercisesService.checkAnswer(input.exerciseId, parsedAnswer);

    // Upsert per-province progress with partial credit.
    const newScoreDelta = result.partialCredit;
    const upsertData = {
      exercisesDone: { increment: 1 },
      score: { increment: newScoreDelta },
      lastStudiedAt: new Date(),
    };
    const existing = await this.prisma.userProgress.findUnique({
      where: { userId_provinceId: { userId, provinceId: input.provinceId } },
    });
    if (existing) {
      await this.prisma.userProgress.update({
        where: { id: existing.id },
        data: upsertData,
      });
    } else {
      await this.prisma.userProgress.create({
        data: {
          userId,
          provinceId: input.provinceId,
          exercisesDone: 1,
          score: newScoreDelta,
        },
      });
    }

    // If the exercise is linked to a word, also feed FSRS so it schedules the word.
    if (result.wordId) {
      const session = await this.prisma.reviewSession.create({
        data: { userId, mode: ReviewMode.LESSON_POST, provinceId: input.provinceId },
      });
      await this.srsService.ensureProgressForWords(userId, [result.wordId]);
      await this.srsService.recordReview(
        userId,
        session.id,
        result.wordId,
        result.correct ? ReviewRating.GOOD : ReviewRating.AGAIN,
      );
      await this.srsService.endSession(session.id);
    }

    const progress = await this.prisma.userProgress.findUniqueOrThrow({
      where: { userId_provinceId: { userId, provinceId: input.provinceId } },
    });

    return {
      correct: result.correct,
      exerciseId: input.exerciseId,
      correctAnswer: result.correctAnswer,
      partialCredit: result.partialCredit,
      score: progress.score,
      exercisesDone: progress.exercisesDone,
    };
  }
}