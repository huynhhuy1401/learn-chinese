import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesResolver } from './exercises.resolver';
import { ExerciseStrategyFactory } from './strategies/exercise-strategy.factory';
import { SrsModule } from '../srs/srs.module';

@Module({
  imports: [SrsModule],
  providers: [ExercisesService, ExercisesResolver, ExerciseStrategyFactory],
  exports: [ExercisesService],
})
export class ExercisesModule {}