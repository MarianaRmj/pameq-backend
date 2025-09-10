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

  // --- Calificaciones ---
  @Post('estandares/:estandarId/calificaciones')
  registrarCalificacion(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: CreateCalificacionDto,
  ) {
    return this.service.registrarCalificacion(estandarId, dto);
  }

  // --- Evaluación cualitativa completa (save) ---
  @Post('estandares/:estandarId/evaluacion-cualitativa')
  registrarEvaluacionCualitativa(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: CreateEvaluacionCualitativaDto,
  ) {
    return this.service.registrarEvaluacionCualitativa(estandarId, dto);
  }

  // --- Listados ---
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

  // --- Fortalezas ---
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

  // --- Oportunidades ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/oportunidades_mejora')
  addOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addOportunidad(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/oportunidades_mejora')
  updateOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateOportunidad(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/oportunidades_mejora')
  removeOportunidad(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeOportunidad(estandarId, dto);
  }

  // --- Efecto de Oportunidades ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/efecto_oportunidades')
  addEfecto(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addEfecto(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/efecto_oportunidades')
  updateEfecto(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateEfecto(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/efecto_oportunidades')
  removeEfecto(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeEfecto(estandarId, dto);
  }

  // --- Acciones de Mejora ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/acciones_mejora')
  addAccion(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addAccion(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/acciones_mejora')
  updateAccion(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateAccion(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/acciones_mejora')
  removeAccion(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeAccion(estandarId, dto);
  }

  // --- Limitantes ---
  @Post('estandares/:estandarId/evaluacion-cualitativa/limitantes_acciones')
  addLimitante(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: AddItemDto,
  ) {
    return this.service.addLimitante(estandarId, dto);
  }

  @Patch('estandares/:estandarId/evaluacion-cualitativa/limitantes_acciones')
  updateLimitante(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.service.updateLimitante(estandarId, dto);
  }

  @Delete('estandares/:estandarId/evaluacion-cualitativa/limitantes_acciones')
  removeLimitante(
    @Param('estandarId', ParseIntPipe) estandarId: number,
    @Body() dto: RemoveItemDto,
  ) {
    return this.service.removeLimitante(estandarId, dto);
  }
}
