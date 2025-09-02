import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CreateEvaluacionCualitativaDto } from './dto/create-evaluacion-cualitativa.dto';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly service: EvaluacionService) {}

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
    console.log('📦 DTO recibido:', dto);
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
}
