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
        nombre_ips: 'Fundación Diversidad',
        nit: '900123456-7',
        tipo_institucion: 'Publica',
        correo_contacto: 'diversidad@gmail.com',
        direccion_principal: 'Cra. 45 #10-50',
        telefono: '6041234567',
        codigo_habilitacion: 'FD-001',
        nombre_representante: 'Adriana Gómez',
        nivel_complejidad: 'Media',
        sedes: [
          {
            nombre_sede: 'Sede A',
            direccion: 'Medellín - Cra. 50',
            telefono: '6041111111',
            nombre_lider: 'Lina Pérez',
            codigo_habilitacion: 'FD-S01',
          },
          {
            nombre_sede: 'Sede B',
            direccion: 'Medellín - Cl. 20',
            telefono: '6042222222',
            nombre_lider: 'Carlos Ruiz',
            codigo_habilitacion: 'FD-S02',
          },
        ],
      },
      {
        nombre_ips: 'Clínica PAMEQ',
        nit: '901987654-3',
        tipo_institucion: 'Privada',
        correo_contacto: 'admin@gmail.com',
        direccion_principal: 'Av. 68 #30',
        telefono: '6015555555',
        codigo_habilitacion: 'CP-001',
        nombre_representante: 'Luis Martínez',
        nivel_complejidad: 'Alta',
        sedes: [
          {
            nombre_sede: 'Sede Bogotá',
            direccion: 'Bogotá - Calle 80',
            telefono: '6011234567',
            nombre_lider: 'Paula Ríos',
            codigo_habilitacion: 'CP-BG01',
          },
          {
            nombre_sede: 'Sede Cali',
            direccion: 'Cali - Av. 3N',
            telefono: '6028765432',
            nombre_lider: 'Andrés Vargas',
            codigo_habilitacion: 'CP-CL01',
          },
        ],
      },
    ];

    for (const instData of instituciones) {
      let institution = await this.institutionRepo.findOne({
        where: { nit: instData.nit },
      });

      if (!institution) {
        institution = this.institutionRepo.create(instData);
        institution = await this.institutionRepo.save(institution);
        console.log(`✅ Institución creada: ${institution.nombre_ips}`);
      } else {
        console.log(`⚠️  Institución ya existe: ${institution.nombre_ips}`);
      }

      for (const sedeData of instData.sedes) {
        const exists = await this.sedeRepo.findOne({
          where: {
            nombre_sede: sedeData.nombre_sede,
            direccion: sedeData.direccion,
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
          console.log(`  ➕ Sede creada: ${savedSede.nombre_sede}`);
        } else {
          console.log(`  ⚠️  Sede ya existe: ${exists.nombre_sede}`);
        }
      }
    }

    console.log('✅ Proceso de seed completado.');
  }
}
