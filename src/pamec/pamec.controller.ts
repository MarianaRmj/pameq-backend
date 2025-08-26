// src/pamec/pamec.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PamecService } from './pamec.service';
import {
  CreateRespuestaFormularioDto,
  UpdateRespuestaFormularioDto,
} from './dto/create-respuesta.dto';

@Controller()
export class PamecController {
  constructor(private readonly service: PamecService) {}

  @Get('cycles/:cicloId/etapas')
  getEtapas(
    @Param('cicloId', ParseIntPipe) cicloId: number,
    @Query('withProgress', new ParseBoolPipe({ optional: true }))
    withProgress?: boolean,
  ) {
    return this.service.getEtapasByCiclo(cicloId, withProgress ?? false);
  }

  @Get('etapas/:etapaId/formularios')
  getFormularios(
    @Param('etapaId', ParseIntPipe) etapaId: number,
    @Query('includeFields', new ParseBoolPipe({ optional: true }))
    includeFields?: boolean,
  ) {
    return this.service.getFormulariosByEtapa(etapaId, includeFields ?? false);
  }

  @Post('formularios/:formularioId/respuestas')
  createRespuesta(
    @Param('formularioId', ParseIntPipe) formularioId: number,
    @Body() dto: CreateRespuestaFormularioDto,
  ) {
    return this.service.crearRespuesta(formularioId, dto);
  }

  @Get('formularios/:formularioId/respuestas/:respuestaId')
  getRespuesta(@Param('respuestaId', ParseIntPipe) respuestaId: number) {
    return this.service.getRespuestaCompleta(respuestaId);
  }

  @Patch('formularios/respuestas/:respuestaId')
  updateRespuesta(
    @Param('respuestaId', ParseIntPipe) respuestaId: number,
    @Body() dto: UpdateRespuestaFormularioDto,
  ) {
    return this.service.actualizarRespuesta(respuestaId, dto);
  }

  @Get('cycles/:cicloId/formularios/respuestas')
  listRespuestasPorCiclo(@Param('cicloId', ParseIntPipe) cicloId: number) {
    return this.service.listarRespuestasPorCiclo(cicloId);
  }
}
