import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { InstitutionSedeSeeder } from './institution-sede.seeder';
import { CycleSeeder } from './ciclo.seeder';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Sede, Ciclo])],
  providers: [InstitutionSedeSeeder, CycleSeeder],
  exports: [InstitutionSedeSeeder],
})
export class SeedModule {}
