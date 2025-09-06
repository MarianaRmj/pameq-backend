import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenciaFortaleza } from './entities/evidencia-fortaleza.entity';
import { EvidenciaFortalezaService } from './evidencia-fortaleza.service';
import { EvidenciaFortalezaController } from './evidencia-fortaleza.controller';
import { StorageModule } from 'src/storage/storage.module'; // 👈 Aquí

@Module({
  imports: [
    TypeOrmModule.forFeature([EvidenciaFortaleza]),
    StorageModule, // ✅ Lo agregas aquí
  ],
  controllers: [EvidenciaFortalezaController],
  providers: [EvidenciaFortalezaService],
})
export class EvidenciaFortalezaModule {}
