import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { VocabularyWord } from '../../vocabulary/dto/vocabulary-word.dto';
import { GrammarPoint } from '../../grammar/dto/grammar-point.dto';
import { Exercise } from '../../exercises/dto/exercise.dto';

@ObjectType()
export class Province {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  capital: string;

  @Field()
  culturalDescription: string;

  @Field()
  landmark: string;

  @Field()
  landmarkFact: string;

  @Field()
  food: string;

  @Field()
  foodDescription: string;

  @Field()
  custom: string;

  @Field()
  mapCoordinates: string;

  @Field(() => Int)
  unlockOrder: number;

  @Field()
  color: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  storyContent?: string;

  @Field(() => [VocabularyWord], { nullable: true })
  vocabulary?: VocabularyWord[];

  @Field(() => [GrammarPoint], { nullable: true })
  grammar?: GrammarPoint[];

  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[];
}
