import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UsersService } from './users.service';
import { User } from './dto/user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  /// Existing alias — kept for back-compat.
  @Query(() => User)
  @UseGuards(SupabaseAuthGuard)
  async me(@Context() ctx: any) {
    return this.usersService.upsertFromSupabase(ctx.req.user);
  }

  /// Canonical current-user query for the frontend `useUser()` hook.
  @Query(() => User)
  @UseGuards(SupabaseAuthGuard)
  async currentUser(@Context() ctx: any) {
    return this.usersService.upsertFromSupabase(ctx.req.user);
  }
}