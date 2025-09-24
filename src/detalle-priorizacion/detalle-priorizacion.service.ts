// // src/evaluacion/detalle-priorizacion.service.ts

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { DetallePriorizacionEstandar } from './entities/detalle-priorizacion.entity';
// import { CreateDetallePriorizacionDto } from './dto/create-detalle-priorizacion.dto';
// import { UpdateDetallePriorizacionDto } from './dto/update-detalle-priorizacion.dto';

// @Injectable()
// export class DetallePriorizacionService {
//   constructor(
//     @InjectRepository(DetallePriorizacionEstandar)
//     private readonly repo: Repository<DetallePriorizacionEstandar>,
//   ) {}

//   create(priorizacionId: number, dto: CreateDetallePriorizacionDto) {
//     const detalle = this.repo.create({
//       ...dto,
//       priorizacion_id: priorizacionId,
//     });
//     return this.repo.save(detalle);
//   }

//   findByPriorizacion(priorizacionId: number) {
//     return this.repo.findOneBy({ priorizacion_id: priorizacionId });
//   }

//   async update(id: number, dto: UpdateDetallePriorizacionDto) {
//     const detalle = await this.repo.findOneBy({ id });
//     if (!detalle) throw new NotFoundException('Detalle no encontrado');
//     return this.repo.save({ ...detalle, ...dto });
//   }
// }
