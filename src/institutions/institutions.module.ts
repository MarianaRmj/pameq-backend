import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from './entities/institution.entity';
import { InstitutionsService } from './institutions.service';
import { InstitutionsController } from './institutions.controller';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Institution, Ciclo])],
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
})
export class InstitutionsModule {}
