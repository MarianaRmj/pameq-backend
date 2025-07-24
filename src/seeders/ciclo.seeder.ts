import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { CicloEstado } from 'src/cycles/enums/ciclo-estado.enum';

@Injectable()
export class CycleSeeder {
  constructor(
    @InjectRepository(Ciclo)
    private readonly cicloRepo: Repository<Ciclo>,
    @InjectRepository(Sede)
    private readonly sedeRepo: Repository<Sede>,
    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
  ) {}

  async run() {
    const nombres = ['1', '2', 'A'];
    const sedes: Sede[] = [];

    for (const nombre of nombres) {
      const sede = await this.sedeRepo.findOne({
        where: { nombre_sede: nombre },
        relations: ['institution'],
      });
      if (sede) {
        sedes.push(sede);
      } else {
        console.warn(`⚠️ Sede no encontrada: ${nombre}`);
      }
    }

    if (sedes.length === 0) {
      console.log('⚠️ No se encontraron sedes válidas para ciclos.');
      return;
    }

    for (const sede of sedes) {
      const cicloExistente = await this.cicloRepo.findOne({
        where: {
          sede: { id: sede.id },
          fecha_inicio: '2025-01-01',
          fecha_fin: '2025-12-31',
        },
        relations: ['sede'],
      });

      if (cicloExistente) {
        console.log(`⚠️ Ciclo ya existe para ${sede.nombre_sede}`);
        continue;
      }

      const ciclo = this.cicloRepo.create({
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        enfoque: 'Acreditación',
        estado: CicloEstado.ACTIVO,
        observaciones: 'Primer ciclo institucional',
        sede,
        institution: sede.institution, // ✅ corregido
      });

      await this.cicloRepo.save(ciclo);
      console.log(`✅ Ciclo creado para ${sede.nombre_sede}`);
    }
  }
}
