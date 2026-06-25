import { Resolver, Query, Mutation, Args, Context, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SrsService } from './srs.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import {
  DueCard,
  ReviewStats,
  ReviewSessionRef,
  ReviewResult,
  StartReviewSessionInput,
  RecordReviewInput,
} from './srs.dto';
import { ReviewMode } from '@prisma/client';

@Resolver()
export class SrsResolver {
  constructor(private srsService: SrsService) {}

  @Query(() => [DueCard])
  @UseGuards(SupabaseAuthGuard)
  async dueCards(
    @Context() ctx: any,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('mode', { type: () => ReviewMode, defaultValue: ReviewMode.DAILY }) mode: ReviewMode,
    @Args('provinceId', { type: () => ID, nullable: true }) provinceId?: string,
  ): Promise<DueCard[]> {
    return this.srsService.getDueCards(ctx.req.user.id, mode, limit, provinceId);
  }

  @Query(() => ReviewStats)
  @UseGuards(SupabaseAuthGuard)
  async reviewStats(@Context() ctx: any): Promise<ReviewStats> {
    return this.srsService.getReviewStats(ctx.req.user.id);
  }

  @Mutation(() => ReviewSessionRef)
  @UseGuards(SupabaseAuthGuard)
  async startReviewSession(
    @Context() ctx: any,
    @Args('input') input: StartReviewSessionInput,
  ): Promise<ReviewSessionRef> {
    return this.srsService.startSession(
      ctx.req.user.id,
      input.mode,
      input.provinceId,
      input.limit ?? 20,
    );
  }

  @Mutation(() => ReviewResult)
  @UseGuards(SupabaseAuthGuard)
  async recordReview(
    @Context() ctx: any,
    @Args('input') input: RecordReviewInput,
  ): Promise<ReviewResult> {
    return this.srsService.recordReview(
      ctx.req.user.id,
      input.sessionId,
      input.wordId,
      input.rating,
    );
  }
}
