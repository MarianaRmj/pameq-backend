// src/plan-mejoramiento/plan-mejoramiento.controller.ts

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanMejoramientoService } from './plan-mejoramiento.service';
import { CreateAccionDto } from './dto/create-accion.dto';
import { UpdateAccionDto } from './dto/update-accion.dto';

@Controller()
export class PlanMejoramientoController {
  constructor(private readonly service: PlanMejoramientoService) {}

  @Post('/priorizacion/:priorizacionId/acciones')
  create(
    @Param('priorizacionId', ParseIntPipe) priorizacionId: number,
    @Body() dto: CreateAccionDto,
  ) {
    return this.service.create(priorizacionId, dto);
  }

  @Get('/priorizacion/:priorizacionId/acciones')
  findAll(@Param('priorizacionId', ParseIntPipe) priorizacionId: number) {
    return this.service.findByPriorizacion(priorizacionId);
  }

  @Get('/acciones/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch('/acciones/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccionDto) {
    return this.service.update(id, dto);
  }

  @Delete('/acciones/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
