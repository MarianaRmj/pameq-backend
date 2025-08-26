// src/pamec/pamec.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaRutaCritica } from './entities/etapa.entity';
import { AvanceEtapa } from './entities/avance-etapa.entity';
import { FormularioEtapa } from './entities/formulario.entity';
import { CampoFormulario } from './entities/campo.entity';
import { PamecService } from './pamec.service';
import { PamecController } from './pamec.controller';
import {
  AnexoFormulario,
  RespuestaFormulario,
  ValorRespuesta,
} from './entities/respuesta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EtapaRutaCritica,
      AvanceEtapa,
      FormularioEtapa,
      CampoFormulario,
      RespuestaFormulario,
      ValorRespuesta,
      AnexoFormulario,
    ]),
  ],
  controllers: [PamecController],
  providers: [PamecService],
})
export class PamecModule {}
