import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { Proceso } from './entities/process.entity';
import { IndicadorProceso } from './entities/indicador-proceso.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { EstandarSeleccionado } from 'src/evaluacion/entities/estandares-seleccionados.entity';
import { EvaluacionModule } from 'src/evaluacion/evaluacion.module'; // 👈 aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proceso,
      Institution,
      IndicadorProceso,
      EstandarSeleccionado,
    ]),
    EvaluacionModule, // 👈 ahora sí está disponible el repo de EvaluacionCualitativaEstandar
  ],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
