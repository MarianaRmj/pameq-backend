import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatrizPriorizacionController } from './matriz_priorizacion.controller';
import { MatrizPriorizacionService } from './matriz_priorizacion.service';

import { PriorizacionCriterio } from './entities/priorizacion-criterio.entity';
import { PriorizacionRegistro } from './entities/priorizacion-registro.entity';

import { Proceso } from 'src/processes/entities/process.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { EstandarSeleccionado } from 'src/evaluacion/entities/estandares-seleccionados.entity';
import { FortalezaEstandar } from 'src/fortalezas/entities/fortaleza.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriorizacionCriterio,
      PriorizacionRegistro,
      Proceso,
      Estandar,
      EstandarSeleccionado,
      FortalezaEstandar,
      OportunidadMejoraEstandar,
      EvaluacionCualitativaEstandar,
    ]),
  ],
  controllers: [MatrizPriorizacionController],
  providers: [MatrizPriorizacionService],
  exports: [MatrizPriorizacionService],
})
export class MatrizPriorizacionModule {}
