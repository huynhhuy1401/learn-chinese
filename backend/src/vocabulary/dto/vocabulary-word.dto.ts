import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

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

  @Field({ nullable: true })
  masteryLevel?: number;

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
