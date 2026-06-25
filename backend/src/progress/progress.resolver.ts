import { Resolver, Query, Mutation, Args, ID, Context, InputType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IsString, IsBoolean, MinLength } from 'class-validator';
import { ProgressService } from './progress.service';
import { UserProgress, UserWordProgress } from './dto/user-progress.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@InputType()
export class ProvinceIdInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  provinceId: string;
}

@InputType()
export class ReviewWordInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  wordId: string;

  @Field()
  @IsBoolean()
  correct: boolean;
}

@Resolver()
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @Query(() => [UserProgress])
  @UseGuards(SupabaseAuthGuard)
  async userProgress(@Context() ctx: any) {
    return this.progressService.getUserProgress(ctx.req.user.id);
  }

  @Query(() => [UserWordProgress])
  @UseGuards(SupabaseAuthGuard)
  async wordProgress(@Context() ctx: any) {
    return this.progressService.getWordProgresses(ctx.req.user.id);
  }

  @Mutation(() => UserProgress)
  @UseGuards(SupabaseAuthGuard)
  async completeProvince(@Context() ctx: any, @Args('input') input: ProvinceIdInput) {
    return this.progressService.completeProvince(ctx.req.user.id, input.provinceId);
  }

  /// Legacy entry — maps correct → GOOD/EASY, wrong → AGAIN via FSRS.
  /// Prefer `recordReview` from the SRS module for finer grading.
  @Mutation(() => UserWordProgress)
  @UseGuards(SupabaseAuthGuard)
  async reviewWord(@Context() ctx: any, @Args('input') input: ReviewWordInput) {
    return this.progressService.reviewWord(ctx.req.user.id, input.wordId, input.correct);
  }
}