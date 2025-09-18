// src/oportunidades/oportunidad-mejora.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OportunidadesService } from './oportunidad-mejora.service';
import { CreateOportunidadDto } from './dto/create-oportunidad-mejora.dto';
import { UpdateOportunidadDto } from './dto/update-oportunidad-mejora.dto';

@Controller('evaluacion/oportunidades-mejora')
export class OportunidadesController {
  constructor(private readonly service: OportunidadesService) {}

  @Post()
  create(@Body() dto: CreateOportunidadDto) {
    return this.service.create(dto);
  }

  @Get(':evaluacionId')
  findAll(@Param('evaluacionId', ParseIntPipe) evaluacionId: number) {
    return this.service.findAllByEvaluacion(evaluacionId);
  }

  @Get(':autoevaluacionId/estandar/:estandarId')
  findAllByEvaluacionYEst(
    @Param('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
    @Param('estandarId', ParseIntPipe) estandarId: number,
  ) {
    return this.service.findAllByEvaluacionYEst(autoevaluacionId, estandarId);
  }

  @Patch()
  update(@Body() dto: UpdateOportunidadDto) {
    return this.service.update(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
