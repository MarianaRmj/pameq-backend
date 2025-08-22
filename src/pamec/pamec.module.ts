import { Module } from '@nestjs/common';
import { PamecService } from './pamec.service';
import { PamecController } from './pamec.controller';

@Module({
  controllers: [PamecController],
  providers: [PamecService],
})
export class PamecModule {}
