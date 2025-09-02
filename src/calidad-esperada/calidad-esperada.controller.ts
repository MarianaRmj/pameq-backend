import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CalidadEsperadaService } from './calidad-esperada.service';
import { CreateCalidadEsperadaDto } from './dto/create-calidad-esperada.dto';
import { UpdateCalidadEsperadaDto } from './dto/update-calidad-esperada.dto';

@Controller('calidad-esperada')
export class CalidadEsperadaController {
  constructor(private readonly calidadService: CalidadEsperadaService) {}

  @Post()
  create(@Body() dto: CreateCalidadEsperadaDto) {
    return this.calidadService.create(dto);
  }

  @Get()
  findAll() {
    return this.calidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCalidadEsperadaDto) {
    return this.calidadService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calidadService.remove(+id);
  }

  @Get('priorizacion/:priorizacion_id')
  findByPriorizacion(@Param('priorizacion_id') priorizacion_id: string) {
    return this.calidadService.findByPriorizacion(+priorizacion_id);
  }
}
