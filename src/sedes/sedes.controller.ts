import { Controller, Post, Body } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  create(@Body() dto: CreateSedeDto) {
    return this.sedesService.create(dto);
  }
}
