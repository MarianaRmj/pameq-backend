// src/fortalezas/fortaleza.controller.ts
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
import { FortalezasService } from './fortalezas.service';
import { CreateFortalezaDto } from './dto/create-fortaleza.dto';
import { UpdateFortalezaDto } from './dto/update-fortaleza.dto';

@Controller('evaluacion/fortalezas')
export class FortalezasController {
  constructor(private readonly service: FortalezasService) {}

  @Post()
  create(@Body() dto: CreateFortalezaDto) {
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
  update(@Body() dto: UpdateFortalezaDto) {
    return this.service.update(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
