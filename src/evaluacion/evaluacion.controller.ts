// evaluacion.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CreateEvaluacionCualitativaDto } from './dto/create-evaluacion-cualitativa.dto';
import {
  AddItemDto,
  RemoveItemDto,
  UpdateItemDto,
} from './entities/qualitative-item.dto';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly service: EvaluacionService) {}

  // --- Tus rutas existentes ---
  @Post('estandares/:estandarId/calificaciones')
  registrarCalificacion(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: CreateCalificacionDto,
  ) {
    return this.service.registrarCalificacion(estandarId, dto);
  }

  @Post('estandares/:estandarId/evaluacion-cualitativa')
  registrarEvaluacionCualitativa(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: CreateEvaluacionCualitativaDto,
  ) {
    return this.service.registrarEvaluacionCualitativa(estandarId, dto);
  }

  @Get('autoevaluaciones/:autoevaluacionId/estandares')
  listarPorAutoevaluacion(
    @Param('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
  ) {
    return this.service.listarPorAutoevaluacion(autoevaluacionId);
  }

  @Get('autoevaluaciones/:autoevaluacionId/estandares-completo')
  listarEvaluacion(
    @Param('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
  ) {
    return this.service.listarEvaluacionPorAutoevaluacion(autoevaluacionId);
  }

  @Get('estandares/:estandarId/calificaciones')
  obtenerCalificacion(@Param('estandarId', ParseIntPipe) estandarId: number) {
    return this.service.obtenerCalificacion(estandarId);
  }

  // ⚠️ Mejora: esta versión recibe también autoevaluacionId (query) para traer la fila correcta
  @Get('estandares/:estandarId/evaluacion-cualitativa')
  obtenerEvaluacionCualitativa(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Query('autoevaluacionId', ParseIntPipe) autoevaluacionId: number,
  ) {
    return this.service.obtenerEvaluacionCualitativa(
      estandarId,
      autoevaluacionId,
    );
  }

  // --- Rutas nuevas: Fortalezas ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/fortalezas')
  addFortaleza(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addFortaleza(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/fortalezas')
  updateFortaleza(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateFortaleza(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/fortalezas')
  removeFortaleza(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeFortaleza(estandarId, dto);
  }

  // --- Rutas nuevas: Oportunidades ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/oportunidades')
  addOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addOportunidad(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/oportunidades')
  updateOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateOportunidad(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/oportunidades')
  removeOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeOportunidad(estandarId, dto);
  }
}
