import { Module } from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CyclesController } from './cycles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciclo } from './entities/cycle.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { CycleSeeder } from 'src/seeders/ciclo.seeder';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ciclo, Sede, Institution, Event])],
  controllers: [CyclesController],
  providers: [CyclesService, CycleSeeder],
})
export class CyclesModule {}
