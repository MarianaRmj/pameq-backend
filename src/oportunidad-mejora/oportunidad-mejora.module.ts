import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OportunidadesService } from './oportunidad-mejora.service';
import { OportunidadesController } from './oportunidad-mejora.controller';
import { OportunidadMejoraEstandar } from './entities/oportunidad-mejora.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OportunidadMejoraEstandar,
      EvaluacionCualitativaEstandar,
      Proceso,
    ]),
  ],
  providers: [OportunidadesService],
  controllers: [OportunidadesController],
  exports: [OportunidadesService],
})
export class OportunidadMejoraModule {}
