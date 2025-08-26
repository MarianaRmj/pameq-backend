// src/autoevaluacion/autoevaluacion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autoevaluacion } from './entities/autoevaluacion.entity';
import { AutoevaluacionService } from './autoevaluacion.service';
import { AutoevaluacionController } from './autoevaluacion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Autoevaluacion])],
  providers: [AutoevaluacionService],
  controllers: [AutoevaluacionController],
})
export class AutoevaluacionModule {}
