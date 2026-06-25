import { Injectable } from '@nestjs/common';
import { ExerciseType } from '@prisma/client';
import { ExerciseStrategy } from './strategy.types';
import { McqStrategy } from './mcq.strategy';
import { RecallMeaningStrategy, RecallReadingStrategy } from './recall.strategy';
import { ListeningStrategy } from './listening.strategy';
import { ToneStrategy } from './tone.strategy';
import { WritingStrategy } from './writing.strategy';
import { FillBlankStrategy } from './fill-blank.strategy';
import { MatchingStrategy } from './matching.strategy';
import { CulturalStrategy } from './cultural.strategy';

/**
 * Resolve the evaluation strategy for an exercise by its `type`.
 */
@Injectable()
export class ExerciseStrategyFactory {
  private readonly strategies: Record<ExerciseType, ExerciseStrategy>;

  constructor() {
    this.strategies = {
      [ExerciseType.MULTIPLE_CHOICE]: new McqStrategy(),
      [ExerciseType.RECALL_MEANING]: new RecallMeaningStrategy(),
      [ExerciseType.RECALL_READING]: new RecallReadingStrategy(),
      [ExerciseType.LISTENING]: new ListeningStrategy(),
      [ExerciseType.TONE]: new ToneStrategy(),
      [ExerciseType.WRITING]: new WritingStrategy(),
      [ExerciseType.FILL_BLANK]: new FillBlankStrategy(),
      [ExerciseType.MATCHING]: new MatchingStrategy(),
      [ExerciseType.CULTURAL]: new CulturalStrategy(),
    };
  }

  for(type: ExerciseType): ExerciseStrategy {
    return this.strategies[type] ?? this.strategies[ExerciseType.MULTIPLE_CHOICE];
  }
}