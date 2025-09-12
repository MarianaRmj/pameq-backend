import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OportunidadesService } from './oportunidad-mejora.service';
import { CreateOportunidadDto } from './dto/create-oportunidad-mejora.dto';

@Controller('evaluacion/oportunidades-mejora')
export class OportunidadesController {
  constructor(private readonly service: OportunidadesService) {}

  // ➕ Crear oportunidad de mejora
  @Post()
  create(@Body() dto: CreateOportunidadDto) {
    return this.service.create(dto);
  }

  // 📋 Listar todas las oportunidades de una evaluación
  @Get(':evaluacionId')
  findAll(@Param('evaluacionId', ParseIntPipe) evaluacionId: number) {
    return this.service.findAllByEvaluacion(evaluacionId);
  }

  // 🗑️ Eliminar oportunidad
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
