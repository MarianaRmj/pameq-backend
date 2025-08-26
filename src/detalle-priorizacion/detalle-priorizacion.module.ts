import { Module } from '@nestjs/common';
import { DetallePriorizacionService } from './detalle-priorizacion.service';
import { DetallePriorizacionController } from './detalle-priorizacion.controller';
import { DetallePriorizacionEstandar } from './entities/detalle-priorizacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriorizacionEstandar } from 'src/priorizacion/entities/priorizacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DetallePriorizacionEstandar,
      PriorizacionEstandar,
    ]),
  ],
  controllers: [DetallePriorizacionController],
  providers: [DetallePriorizacionService],
})
export class DetallePriorizacionModule {}
