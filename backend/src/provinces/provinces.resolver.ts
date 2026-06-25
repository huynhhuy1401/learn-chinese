import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { ProvincesService } from './provinces.service';
import { Province } from './dto/province.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Resolver(() => Province)
export class ProvincesResolver {
  constructor(
    private provincesService: ProvincesService,
    private supabaseService: SupabaseService,
  ) {}

  @Query(() => [Province])
  async provinces() {
    return this.provincesService.findAll();
  }

  @Query(() => Province, { nullable: true })
  async province(@Args('id', { type: () => ID }) id: string) {
    return this.provincesService.findById(id);
  }

  /// The next province a logged-in user should travel to, based on completed provinces.
  /// For guests returns the first province.
  @Query(() => Province, { nullable: true })
  async nextProvince(@Context() ctx: any) {
    const userId = await this.bestEffortUserId(ctx);
    return this.provincesService.getNextUnlocked(userId);
  }

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
}

@Resolver(() => Province)
export class ProvinceProgressResolver {
  constructor(
    private provincesService: ProvincesService,
    private supabaseService: SupabaseService,
  ) {}

  /// Is the province unlocked for this user? Driven by completion of all earlier provinces.
  @Query(() => Boolean)
  async isProvinceUnlocked(@Context() ctx: any, @Args('provinceId', { type: () => ID }) provinceId: string) {
    const req = ctx?.req;
    let userId: string | null = null;
    if (req?.user?.id) {
      userId = req.user.id as string;
    } else {
      const header = req?.headers?.authorization;
      if (header) {
        try {
          const user = await this.supabaseService.getUser(header.replace('Bearer ', ''));
          userId = user?.id ?? null;
        } catch {}
      }
    }
    return this.provincesService.isUnlocked(userId, provinceId);
  }
}