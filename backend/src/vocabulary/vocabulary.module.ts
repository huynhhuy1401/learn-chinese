import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyResolver } from './vocabulary.resolver';

@Module({
  providers: [VocabularyService, VocabularyResolver],
  exports: [VocabularyService],
})
export class VocabularyModule {}
