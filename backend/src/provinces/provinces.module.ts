import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvincesResolver } from './provinces.resolver';

@Module({
  providers: [ProvincesService, ProvincesResolver],
  exports: [ProvincesService],
})
export class ProvincesModule {}
