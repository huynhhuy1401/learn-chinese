import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UserProgress, UserWordProgress } from './dto/user-progress.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

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
  async completeProvince(
    @Context() ctx: any,
    @Args('provinceId', { type: () => ID }) provinceId: string,
  ) {
    return this.progressService.completeProvince(ctx.req.user.id, provinceId);
  }

  @Mutation(() => UserWordProgress)
  @UseGuards(SupabaseAuthGuard)
  async reviewWord(
    @Context() ctx: any,
    @Args('wordId', { type: () => ID }) wordId: string,
    @Args('correct') correct: boolean,
  ) {
    return this.progressService.reviewWord(ctx.req.user.id, wordId, correct);
  }
}
