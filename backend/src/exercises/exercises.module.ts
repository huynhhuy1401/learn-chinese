import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesResolver } from './exercises.resolver';

@Module({
  providers: [ExercisesService, ExercisesResolver],
  exports: [ExercisesService],
})
export class ExercisesModule {}
