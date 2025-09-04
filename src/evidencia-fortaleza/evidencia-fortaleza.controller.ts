// evidencia-fortaleza.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { EvidenciaFortalezaService } from './evidencia-fortaleza.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('evidencia-fortaleza')
export class EvidenciaFortalezaController {
  constructor(private readonly service: EvidenciaFortalezaService) {}

  @Post('evidencias/fortalezas')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 10 }]))
  async subirEvidenciasFortalezas(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @Body('autoevaluacionId') autoevaluacionId: number,
    @Body('estandarId') estandarId: number,
  ) {
    return this.service.subirEvidenciasFortalezas(
      files?.file ?? [],
      autoevaluacionId,
      estandarId,
    );
  }

  @Get('estandares/:estandarId/evidencias-fortalezas')
  getEvidenciasPorEstandar(
    @Param('estandarId', ParseIntPipe) estandarId: number,
  ) {
    return this.service.getEvidenciasPorEstandar(estandarId);
  }

  @Delete('evidencias/:id')
  async eliminarEvidencia(@Param('id', ParseIntPipe) id: number) {
    return this.service.eliminarEvidencia(id);
  }
}
