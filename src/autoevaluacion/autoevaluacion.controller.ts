// src/autoevaluacion/autoevaluacion.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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
}
