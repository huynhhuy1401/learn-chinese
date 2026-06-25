import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvincesResolver, ProvinceProgressResolver } from './provinces.resolver';

@Module({
  providers: [ProvincesService, ProvincesResolver, ProvinceProgressResolver],
  exports: [ProvincesService],
})
export class ProvincesModule {}
