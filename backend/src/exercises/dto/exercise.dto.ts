import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Exercise {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  question: string;

  @Field({ nullable: true })
  questionLabel?: string;

  @Field()
  options: string;

  @Field()
  correctAnswer: string;
}
