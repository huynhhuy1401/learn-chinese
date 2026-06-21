import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { GrammarService } from './grammar.service';
import { GrammarPoint } from './dto/grammar-point.dto';

@Resolver(() => GrammarPoint)
export class GrammarResolver {
  constructor(private grammarService: GrammarService) {}

  @Query(() => [GrammarPoint])
  async grammar(
    @Args('provinceId', { type: () => ID, nullable: true }) provinceId?: string,
  ) {
    if (provinceId) {
      return this.grammarService.findByProvince(provinceId);
    }
    return this.grammarService.findAll();
  }
}
