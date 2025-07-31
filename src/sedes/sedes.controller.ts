import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Controller('sedes')
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  create(@Body() dto: CreateSedeDto) {
    return this.sedesService.create(dto);
  }

  @Get()
  findAll() {
    return this.sedesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSedeDto) {
    return this.sedesService.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sedesService.remove(Number(id));
  }
}
