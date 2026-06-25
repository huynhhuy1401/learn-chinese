import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { CardState } from '@prisma/client';

registerEnumType(CardState, {
  name: 'CardFSRSState',
  description: 'FSRS card lifecycle state.',
});

@ObjectType()
export class VocabularyWord {
  @Field(() => ID)
  id: string;

  @Field()
  character: string;

  @Field()
  pinyin: string;

  @Field()
  english: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  travelSentence?: string;

  /// Display mastery (0..5), resolved from UserWordProgress for the current user.
  @Field({ nullable: true })
  masteryLevel?: number;

  /// FSRS state for the current user.
  @Field(() => CardState, { nullable: true })
  srsState?: CardState;

  /// Indicates whether this word is due for review for the current user.
  @Field({ nullable: true })
  isDue?: boolean;

  /// Whether the current user has saved/bookmarked this word.
  @Field({ nullable: true })
  isSaved?: boolean;

  @Field(() => WordProvince, { nullable: true })
  province?: { name: string; color: string };
}

@ObjectType()
export class WordProvince {
  @Field()
  name: string;

  @Field()
  color: string;
}