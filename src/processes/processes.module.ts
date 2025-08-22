import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Proceso } from './entities/process.entity';
import { IndicadorProceso } from './entities/indicador-proceso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proceso, Institution, IndicadorProceso])],
  controllers: [ProcessesController],
  providers: [ProcessesService],
})
export class ProcessesModule {}
