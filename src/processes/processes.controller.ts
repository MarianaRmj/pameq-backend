import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';

@Controller('processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  create(@Body() dto: CreateProcessDto) {
    return this.processesService.create(dto);
  }

  @Get()
  findAll() {
    return this.processesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProcessDto) {
    return this.processesService.update(Number(id), dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.processesService.remove(Number(id));
  }
}
