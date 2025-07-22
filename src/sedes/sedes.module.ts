import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SedesService } from './sedes.service';
import { SedesController } from './sedes.controller';
import { Sede } from './entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sede, Institution])],
  controllers: [SedesController],
  providers: [SedesService],
})
export class SedesModule {}
