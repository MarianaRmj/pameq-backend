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
        enfoque: 'Acreditacion',
        sedes: [
          {
            nombre_sede: '1',
            direccion: 'Medellín - Cra. 34',
            telefono: '6041111111',
            nombre_lider: 'Marcela Pérez',
            codigo_habilitacion: 'FD-S01',
          },
          {
            nombre_sede: '2',
            direccion: 'Medellín - Cl. 20',
            telefono: '6042222223',
            nombre_lider: 'Carlos Ruiz',
            codigo_habilitacion: 'FD-S02',
          },
          {
            nombre_sede: 'A',
            direccion: 'Medellín - Cl. 90',
            telefono: '6042222221',
            nombre_lider: 'Alfonso Ruiz',
            codigo_habilitacion: 'FD-S03',
          },
        ],
      },
    ];

    for (const instData of instituciones) {
      let institution = await this.institutionRepo.findOne({
        where: { nit: instData.nit },
      });

      if (!institution) {
        institution = this.institutionRepo.create({
          nombre_ips: instData.nombre_ips,
          nit: instData.nit,
          tipo_institucion: instData.tipo_institucion,
          correo_contacto: instData.correo_contacto,
          direccion_principal: instData.direccion_principal,
          telefono: instData.telefono,
          codigo_habilitacion: instData.codigo_habilitacion,
          nombre_representante: instData.nombre_representante,
          nivel_complejidad: instData.nivel_complejidad,
          enfoque: instData.enfoque,
        });

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
