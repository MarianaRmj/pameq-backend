import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivitiesService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { StorageEngine } from 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Process } from './entities/process.entity';
import { Repository } from 'typeorm';

// Storage de evidencias

function evidenceMemoryStorage(): StorageEngine {
  return memoryStorage();
}

@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly service: ActivitiesService,
    @InjectRepository(Process)
    private readonly processRepo: Repository<Process>,
  ) {}

  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: FilterActivityDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/evidences')
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: evidenceMemoryStorage() }),
  )
  uploadEvidences(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('✅ Recibiendo archivos:', files);

    return this.service.addEvidences(id, files); // ahora sí usamos los buffers
  }

  @Delete(':id/evidences/:evidenceId')
  deleteEvidence(
    @Param('id', ParseIntPipe) id: number,
    @Param('evidenceId', ParseIntPipe) evidenceId: number,
  ) {
    return this.service.removeEvidence(id, evidenceId);
  }

  // Catálogo de procesos (para el multiselect del front)
  @Get('catalog/processes')
  async getProcesses() {
    return this.processRepo.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }
}
