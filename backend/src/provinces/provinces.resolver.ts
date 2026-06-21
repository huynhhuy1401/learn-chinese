import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { Province } from './dto/province.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Resolver(() => Province)
export class ProvincesResolver {
  constructor(private provincesService: ProvincesService) {}

  @Query(() => [Province])
  async provinces() {
    return this.provincesService.findAll();
  }

  @Query(() => Province, { nullable: true })
  async province(@Args('id', { type: () => ID }) id: string) {
    return this.provincesService.findById(id);
  }
}
