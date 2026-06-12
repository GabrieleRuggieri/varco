import { Module } from '@nestjs/common';
import { SkusController } from './skus.controller';
import { SkusService } from './skus.service';

@Module({
  controllers: [SkusController],
  providers: [SkusService],
})
export class SkusModule {}
