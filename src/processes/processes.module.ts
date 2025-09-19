import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { Proceso } from './entities/process.entity';
import { IndicadorProceso } from './entities/indicador-proceso.entity';
import { SeleccionProceso } from './entities/SeleccionProceso.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proceso,
      IndicadorProceso,
      SeleccionProceso, // ✅ aquí
      Institution,
      Estandar,
      EvaluacionCualitativaEstandar,
      OportunidadMejoraEstandar,
      Ciclo,
    ]),
  ],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
