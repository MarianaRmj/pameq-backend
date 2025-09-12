import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SelectProcessDto } from './dto/select-process.dto';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  // 🔹 Crear un proceso
  @Post()
  create(@Body() dto: CreateProcessDto) {
    return this.processesService.create(dto);
  }

  // 🔹 Listar todos los procesos
  @Get()
  findAll() {
    return this.processesService.findAll();
  }

  // 🔹 Actualizar un proceso
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProcessDto) {
    return this.processesService.update(Number(id), dto);
  }

  // 🔹 Eliminar un proceso
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processesService.remove(Number(id));
  }

  // 🔹 Recuento de oportunidades por proceso
  @Get('recuento/:cicloId')
  getRecuento(@Param('cicloId') cicloId: string) {
    return this.processesService.contarOportunidadesPorProceso(Number(cicloId));
  }

  // 🔹 Guardar selección de procesos
  @Post('seleccion')
  guardarSeleccion(@Body() dto: SelectProcessDto) {
    return this.processesService.guardarSeleccion(dto);
  }

  // 🔹 Listar procesos seleccionados
  @Get('seleccionados/:cicloId')
  listarSeleccionados(@Param('cicloId') cicloId: string) {
    return this.processesService.listarSeleccionadosPorCiclo(Number(cicloId));
  }
}
