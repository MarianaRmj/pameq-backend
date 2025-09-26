import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { MatrizPriorizacionService } from './matriz_priorizacion.service';
import { UpsertPriorizacionDto } from './dto/upsert-priorizacion.dto';

@Controller('matriz-priorizacion')
export class MatrizPriorizacionController {
  constructor(private readonly service: MatrizPriorizacionService) {}

  @Get('criterios')
  getCriterios() {
    return this.service.getCriterios();
  }

  // Solo procesos seleccionados en el ciclo dado
  // GET /matriz-priorizacion/procesos-seleccionados?cicloId=1
  @Get('procesos-seleccionados')
  getProcesosSeleccionados(
    @Query('cicloId') cicloIdRaw?: string, // <-- opcional
  ) {
    const cicloId = cicloIdRaw ? Number(cicloIdRaw) : 0;
    if (cicloIdRaw && !Number.isInteger(cicloId)) {
      throw new BadRequestException('cicloId inválido (debe ser entero).');
    }
    return this.service.getProcesosSeleccionados(cicloId);
  }

  // Matriz del proceso en el ciclo dado
  @Get('matriz/:procesoId')
  list(
    @Param('procesoId', ParseIntPipe) procesoId: number,
    @Query('cicloId') cicloIdRaw?: string, // <-- sin ParseIntPipe aquí
  ) {
    let cicloId: number | undefined = undefined;
    if (typeof cicloIdRaw !== 'undefined') {
      const parsed = Number(cicloIdRaw);
      if (!Number.isInteger(parsed)) {
        throw new BadRequestException('cicloId inválido (debe ser entero).');
      }
      cicloId = parsed;
    }
    return this.service.listMatriz(procesoId, cicloId);
  }

  // Guarda/actualiza una fila (solo números 1/3/5)
  @Post()
  upsert(@Body() dto: UpsertPriorizacionDto) {
    return this.service.upsert(dto);
  }

  @Patch(':registroId/confirmar')
  confirmar(@Param('registroId') id: string) {
    return this.service.confirmar(+id, true);
  }
}
