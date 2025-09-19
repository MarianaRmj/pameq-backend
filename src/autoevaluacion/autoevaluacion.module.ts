import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoevaluacionService } from './autoevaluacion.service';
import { AutoevaluacionController } from './autoevaluacion.controller';
import { Autoevaluacion } from './entities/autoevaluacion.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { CalificacionEstandar } from 'src/evaluacion/entities/calificacion.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Autoevaluacion,
      Estandar,
      CalificacionEstandar,
      EvaluacionCualitativaEstandar,
      OportunidadMejoraEstandar,
    ]),
  ],
  controllers: [AutoevaluacionController],
  providers: [AutoevaluacionService],
  exports: [AutoevaluacionService],
})
export class AutoevaluacionModule {}
