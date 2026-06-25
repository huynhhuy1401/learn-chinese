import {
  InputType,
  Field,
  ObjectType,
  ID,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ReviewMode } from '@prisma/client';
import { ReviewRating } from '@prisma/client';

registerEnumType(ReviewMode, {
  name: 'ReviewMode',
  description: 'Type of review session.',
});

registerEnumType(ReviewRating, {
  name: 'ReviewRating',
  description: 'FSRS review rating: AGAIN/Lapse, HARD, GOOD, EASY.',
});

@ObjectType()
export class DueCard {
  @Field(() => ID)
  wordId: string;

  @Field(() => String)
  character: string;

  @Field()
  pinyin: string;

  @Field()
  english: string;

  @Field({ nullable: true })
  travelSentence?: string;

  @Field(() => String)
  category: string;

  @Field(() => Int)
  masteryLevel: number;

  @Field(() => String)
  state: string; // CardState enum value
}

@InputType()
export class StartReviewSessionInput {
  @Field(() => ReviewMode)
  @IsIn(['DAILY', 'SAVED_ONLY', 'LESSON_PRE', 'LESSON_POST'])
  mode: ReviewMode;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  provinceId?: string;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

@InputType()
export class RecordReviewInput {
  @Field(() => ID)
  @IsString()
  sessionId: string;

  @Field(() => ID)
  @IsString()
  wordId: string;

  @Field(() => ReviewRating)
  @IsIn(['AGAIN', 'HARD', 'GOOD', 'EASY'])
  rating: ReviewRating;
}

@ObjectType()
export class ReviewResult {
  @Field(() => ID)
  wordId: string;

  @Field(() => Int)
  masteryLevel: number;

  @Field(() => String)
  state: string;

  @Field()
  nextReviewAt: Date;

  @Field(() => Int)
  sessionReviewed: number;

  @Field(() => Int)
  sessionCorrect: number;
}

@ObjectType()
export class ReviewStats {
  @Field(() => Int)
  cardsDue: number;

  @Field(() => Int)
  newCardsToday: number;

  @Field(() => Int)
  reviewedToday: number;

  @Field(() => Int)
  retentionPct: number;

  @Field(() => Int)
  streak: number;

  @Field(() => Int)
  longestStreak: number;
}

@ObjectType()
export class ReviewSessionRef {
  @Field(() => ID)
  id: string;

  @Field(() => ReviewMode)
  mode: ReviewMode;

  @Field(() => [DueCard])
  cards: DueCard[];

  @Field(() => Int)
  totalCards: number;
}
