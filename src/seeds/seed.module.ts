import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { InstitutionSedeSeeder } from './institution-sede.seeder';
import { CycleSeeder } from './ciclo.seeder';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { ProcessSeeder } from './process.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Sede, Ciclo, Proceso])],
  providers: [InstitutionSedeSeeder, CycleSeeder, ProcessSeeder],
  exports: [InstitutionSedeSeeder],
})
export class SeedModule {}
