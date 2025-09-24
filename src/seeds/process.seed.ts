import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proceso } from 'src/processes/entities/process.entity';
import { Institution } from 'src/institutions/entities/institution.entity';

@Injectable()
export class ProcessSeeder {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepository: Repository<Proceso>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async run(): Promise<void> {
    // ✅ aseguramos que exista la institución
    const institution = await this.institutionRepository.findOne({
      where: { id: 1 }, // ajusta al ID real
    });

    if (!institution) {
      throw new Error(
        '❌ No hay institución con ID=1. Debes crearla antes de sembrar procesos.',
      );
    }

    const defaults = [
      {
        nombre_proceso: 'Gestión de Calidad',
        descripcion:
          'Proceso orientado al aseguramiento de la calidad en todos los servicios.',
        lider: 'María Pérez',
        numero_integrantes: 5,
        institution,
      },
      {
        nombre_proceso: 'Atención al Usuario',
        descripcion: 'Gestión de PQRSF y satisfacción del usuario.',
        lider: 'Carlos Gómez',
        numero_integrantes: 4,
        institution,
      },
      {
        nombre_proceso: 'Gestión Financiera',
        descripcion: 'Administración de recursos financieros.',
        lider: 'Ana Rodríguez',
        numero_integrantes: 3,
        institution,
      },
      {
        nombre_proceso: 'Talento Humano',
        descripcion: 'Selección, formación y bienestar del personal.',
        lider: 'Luis Hernández',
        numero_integrantes: 6,
        institution,
      },
    ];

    for (const data of defaults) {
      const exists = await this.procesoRepository.findOne({
        where: { nombre_proceso: data.nombre_proceso, institution: { id: 1 } },
      });

      if (!exists) {
        const proceso = this.procesoRepository.create(data);
        await this.procesoRepository.save(proceso);
        console.log(`✅ Proceso creado: ${data.nombre_proceso}`);
      } else {
        console.log(`ℹ️ Proceso ya existe: ${data.nombre_proceso}`);
      }
    }
  }
}
