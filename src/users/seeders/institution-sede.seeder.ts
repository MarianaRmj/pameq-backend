import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';

@Injectable()
export class InstitutionSedeSeeder {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,

    @InjectRepository(Sede)
    private readonly sedeRepo: Repository<Sede>,
  ) {}

  async run() {
    const instituciones = [
      {
        nombre: 'Fundación Diversidad',
        nit: '900123456-7',
        tipo: 'IPS',
        sedes: [
          { nombre: 'Sede A', ciudad: 'Medellín' },
          { nombre: 'Sede 1', ciudad: 'Medellín' },
          { nombre: 'Sede 2', ciudad: 'Medellín' },
          { nombre: 'Sede 3', ciudad: 'Medellín' },
          { nombre: 'Sede 4', ciudad: 'Medellín' },
        ],
      },
      {
        nombre: 'Clínica PAMEQ',
        nit: '901987654-3',
        tipo: 'IPS',
        sedes: [
          { nombre: 'Sede Bogotá', ciudad: 'Bogotá' },
          { nombre: 'Sede Cali', ciudad: 'Cali' },
        ],
      },
    ];

    for (const instData of instituciones) {
      let institution = await this.institutionRepo.findOne({
        where: { nit: instData.nit },
      });

      if (!institution) {
        institution = this.institutionRepo.create({
          nombre: instData.nombre,
          nit: instData.nit,
          tipo: instData.tipo,
        });
        institution = await this.institutionRepo.save(institution);
        console.log(`✅ Institución creada: ${institution.nombre}`);
      } else {
        console.log(`⚠️  Institución ya existe: ${institution.nombre}`);
      }

      for (const sedeData of instData.sedes) {
        const exists = await this.sedeRepo.findOne({
          where: {
            nombre: sedeData.nombre,
            ciudad: sedeData.ciudad,
            institution: { id: institution.id },
          },
          relations: ['institution'],
        });

        if (!exists) {
          const sede = this.sedeRepo.create({
            ...sedeData,
            institution,
          });
          const savedSede = await this.sedeRepo.save(sede);
          console.log(`  ➕ Sede creada: ${savedSede.nombre}`);
        } else {
          console.log(`  ⚠️  Sede ya existe: ${exists.nombre}`);
        }
      }
    }

    console.log('✅ Proceso de seed completado.');
  }
}
