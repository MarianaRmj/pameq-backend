// src/fortalezas/fortaleza.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FortalezasService } from './fortalezas.service';
import { FortalezasController } from './fortalezas.controller';
import { FortalezaEstandar } from './entities/fortaleza.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FortalezaEstandar,
      EvaluacionCualitativaEstandar,
      Proceso,
    ]),
  ],
  providers: [FortalezasService],
  controllers: [FortalezasController],
  exports: [FortalezasService],
})
export class FortalezasModule {}
