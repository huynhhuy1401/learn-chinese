import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { VocabularyService } from './vocabulary.service';
import { VocabularyWord } from './dto/vocabulary-word.dto';

@Resolver(() => VocabularyWord)
export class VocabularyResolver {
  constructor(private vocabularyService: VocabularyService) {}

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
}
