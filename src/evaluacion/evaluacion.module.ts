// src/evaluacion/evaluacion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionCualitativaEstandar } from './entities/evaluacion.entity';
import { Estandar } from './entities/estandar.entity';
import { CalificacionEstandar } from './entities/calificacion.entity';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalificacionEstandar,
      EvaluacionCualitativaEstandar,
      Estandar,
      Autoevaluacion,
      OportunidadMejoraEstandar,
    ]),
  ],
  providers: [EvaluacionService],
  controllers: [EvaluacionController],
  exports: [TypeOrmModule],
})
export class EvaluacionModule {}
