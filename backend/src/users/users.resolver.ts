import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UsersService } from './users.service';
import { User } from './dto/user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(SupabaseAuthGuard)
  async me(@Context() ctx: any) {
    const supabaseUser = ctx.req.user;
    // Upsert: ensure our DB has a matching user row
    return this.usersService.upsertFromSupabase(supabaseUser);
  }
}
