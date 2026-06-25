import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { CardState } from '@prisma/client';

registerEnumType(CardState, {
  name: 'CardState',
  description: 'FSRS card lifecycle state.',
});

@ObjectType()
export class UserProgress {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  provinceId: string;

  @Field()
  completed: boolean;

  @Field(() => Int)
  score: number;

  @Field(() => Int)
  exercisesDone: number;

  @Field()
  lastStudiedAt: Date;
}

@ObjectType()
export class UserWordProgress {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  wordId: string;

  @Field(() => CardState)
  state: CardState;

  @Field(() => Int)
  masteryLevel: number;

  @Field(() => Int)
  timesCorrect: number;

  @Field(() => Int)
  timesWrong: number;

  @Field(() => Int)
  reps: number;

  @Field(() => Int)
  lapses: number;

  @Field({ nullable: true })
  lastReviewedAt?: Date;

  @Field()
  nextReviewAt: Date;
}