import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

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

  @Field(() => Int)
  masteryLevel: number;

  @Field(() => Int)
  timesCorrect: number;

  @Field(() => Int)
  timesWrong: number;

  @Field()
  lastReviewedAt: Date;

  @Field()
  nextReviewAt: Date;
}
