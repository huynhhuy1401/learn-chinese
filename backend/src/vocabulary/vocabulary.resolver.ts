import { Resolver, Query, Args, ID, ResolveField, Root, Context } from '@nestjs/graphql';
import { CardState } from '@prisma/client';
import { VocabularyService } from './vocabulary.service';
import { VocabularyWord } from './dto/vocabulary-word.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Resolver(() => VocabularyWord)
export class VocabularyResolver {
  constructor(
    private vocabularyService: VocabularyService,
    private supabaseService: SupabaseService,
  ) {}

  @Query(() => [VocabularyWord])
  async vocabulary(
    @Args('provinceId', { type: () => ID, nullable: true }) provinceId?: string,
  ) {
    if (provinceId) {
      return this.vocabularyService.findByProvince(provinceId);
    }
    return this.vocabularyService.findAll();
  }

  @Query(() => VocabularyWord, { nullable: true })
  async word(@Args('id', { type: () => ID }) id: string) {
    return this.vocabularyService.findById(id);
  }

  /**
   * Best-effort user id extraction: the `vocabulary`/`word` queries are public
   * (no @UseGuards), so ctx.req.user isn't auto-populated. We attempt to
   * verify the bearer token ourselves without rejecting anonymous requests.
   */
  private async bestEffortUserId(ctx: any): Promise<string | null> {
    const req = ctx?.req;
    if (!req) return null;
    if (req.user?.id) return req.user.id as string;
    const header = req.headers?.authorization;
    if (!header) return null;
    const token = header.replace('Bearer ', '');
    try {
      const user = await this.supabaseService.getUser(token);
      if (user) req.user = user;
      return user?.id ?? null;
    } catch {
      return null;
    }
  }

  // Per-user field resolvers -------------------------------------------------

  @ResolveField('masteryLevel', () => Number, { nullable: true })
  async masteryLevel(@Root() word: any, @Context() ctx: any) {
    const userId = await this.bestEffortUserId(ctx);
    if (!userId) return null;
    const map = await this.vocabularyService.resolveUserStateBatch(userId, [word.id]);
    return map.get(word.id)?.mastery ?? null;
  }

  @ResolveField('srsState', () => CardState, { nullable: true })
  async srsState(@Root() word: any, @Context() ctx: any) {
    const userId = await this.bestEffortUserId(ctx);
    if (!userId) return null;
    const map = await this.vocabularyService.resolveUserStateBatch(userId, [word.id]);
    return map.get(word.id)?.state ?? null;
  }

  @ResolveField('isDue', () => Boolean, { nullable: true })
  async isDue(@Root() word: any, @Context() ctx: any) {
    const userId = await this.bestEffortUserId(ctx);
    if (!userId) return null;
    const map = await this.vocabularyService.resolveUserStateBatch(userId, [word.id]);
    return map.get(word.id)?.isDue ?? null;
  }

  @ResolveField('isSaved', () => Boolean, { nullable: true })
  async isSaved(@Root() word: any, @Context() ctx: any) {
    const userId = await this.bestEffortUserId(ctx);
    if (!userId) return null;
    const map = await this.vocabularyService.resolveUserStateBatch(userId, [word.id]);
    return map.get(word.id)?.isSaved ?? false;
  }
}