import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { InstitutionSedeSeeder } from './institution-sede.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Sede])],
  providers: [InstitutionSedeSeeder],
  exports: [InstitutionSedeSeeder],
})
export class SeedModule {}
