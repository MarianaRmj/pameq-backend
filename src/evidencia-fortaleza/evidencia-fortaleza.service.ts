// evidencia-fortaleza.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvidenciaFortaleza } from './entities/evidencia-fortaleza.entity';
import { GoogleDriveService } from 'src/storage/google-drive.service';

@Injectable()
export class EvidenciaFortalezaService {
  constructor(
    @InjectRepository(EvidenciaFortaleza)
    private readonly repo: Repository<EvidenciaFortaleza>,
    private readonly drive: GoogleDriveService,
  ) {}

  private safeRemoteName(original: string) {
    const base = original
      .normalize('NFKD')
      .replace(/[^\w.\-()\s]/g, '')
      .trim();
    return base || `evidencia-${Date.now()}`;
  }

  async subirEvidenciasFortalezas(
    files: Express.Multer.File[],
    autoevaluacionId: number,
    estandarId: number,
  ) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('No se enviaron archivos válidos');
    }

    const folderName =
      `Evidencias-PAMEC-${autoevaluacionId}-${estandarId}`.slice(0, 200);
    const folderId = await this.drive.ensureFolder(folderName);

    const evidencias: EvidenciaFortaleza[] = [];

    for (const file of files) {
      const remoteName = this.safeRemoteName(file.originalname);

      const up = await this.drive.uploadBuffer({
        buffer: file.buffer,
        filename: remoteName,
        mimeType: file.mimetype,
        parentId: folderId,
      });

      evidencias.push(
        this.repo.create({
          autoevaluacion: { id: autoevaluacionId },
          estandar: { id: estandarId },
          nombre_archivo: file.originalname,
          tipo_archivo: file.mimetype,
          url_archivo: up.webViewLink || up.webContentLink || '',
        }),
      );
    }

    return this.repo.save(evidencias);
  }

  async getEvidenciasPorEstandar(estandarId: number) {
    return this.repo.find({
      where: { estandar: { id: estandarId } },
      order: { fecha_carga: 'DESC' },
    });
  }

  async eliminarEvidencia(id: number) {
    const evidencia = await this.repo.findOne({ where: { id } });
    if (!evidencia) {
      throw new Error('Evidencia no encontrada');
    }

    await this.repo.remove(evidencia);
    return { mensaje: '✅ Evidencia eliminada' };
  }
}
