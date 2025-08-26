// src/hoja-radar/hoja-radar.controller.ts
import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { HojaRadarService } from './hoja-radar.service';

@Controller('autoevaluaciones')
export class HojaRadarController {
  constructor(private readonly service: HojaRadarService) {}

  @Post(':id/hoja-radar')
  generar(@Param('id', ParseIntPipe) id: number) {
    return this.service.generar(id);
  }
}
