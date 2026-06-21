import { Module } from '@nestjs/common';
import { GrammarService } from './grammar.service';
import { GrammarResolver } from './grammar.resolver';

@Module({
  providers: [GrammarService, GrammarResolver],
  exports: [GrammarService],
})
export class GrammarModule {}
