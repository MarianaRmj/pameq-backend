// src/autoevaluacion/autoevaluacion.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AutoevaluacionService } from './autoevaluacion.service';
import { CreateAutoevaluacionDto } from './dto/create-autoevaluacion.dto';

@Controller('autoevaluaciones')
export class AutoevaluacionController {
  constructor(private readonly service: AutoevaluacionService) {}

  @Post()
  crear(@Body() dto: CreateAutoevaluacionDto) {
    return this.service.crear(dto);
  }

  @Get(':ciclo')
  listar(@Param('ciclo') ciclo: string) {
    return this.service.listarPorCiclo(ciclo);
  }

  @Patch(':autoevaluacionId/estandares/:estandarId/confirmar')
  confirmarEstandar(
    @Param('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
    @Param('estandarId', ParseIntPipe) estandarId: number,
  ) {
    return this.service.confirmarEstandar(autoevaluacionId, estandarId);
  }

  @Get(':autoevaluacionId/estandares/:estandarId/estado')
  estadoEstandar(
    @Param('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
    @Param('estandarId', ParseIntPipe) estandarId: number,
  ) {
    return this.service.estadoEstandar(autoevaluacionId, estandarId);
  }
}
