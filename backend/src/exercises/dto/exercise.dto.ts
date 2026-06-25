import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { ExerciseType } from '@prisma/client';

registerEnumType(ExerciseType, {
  name: 'ExerciseType',
  description: 'Type of exercise item.',
});

@ObjectType()
export class Exercise {
  @Field(() => ID)
  id: string;

  @Field(() => ExerciseType)
  type: ExerciseType;

  @Field()
  question: string;

  @Field({ nullable: true })
  questionLabel?: string;

  @Field()
  options: string;

  @Field()
  correctAnswer: string;
}

@ObjectType()
export class ExerciseResult {
  @Field()
  correct: boolean;

  @Field(() => ID)
  exerciseId: string;

  @Field()
  correctAnswer: string;

  @Field()
  partialCredit: number;

  @Field()
  score: number;

  @Field()
  exercisesDone: number;
}