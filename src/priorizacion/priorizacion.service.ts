// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { PriorizacionEstandar } from './entities/priorizacion.entity';
// import { CreatePriorizacionDto } from './dto/create-priorizacion.dto';
// import { UpdatePriorizacionDto } from './dto/update-priorizacion.dto';

// @Injectable()
// export class PriorizacionService {
//   constructor(
//     @InjectRepository(PriorizacionEstandar)
//     private repo: Repository<PriorizacionEstandar>,
//   ) {}

//   crear(estandarId: number, dto: CreatePriorizacionDto) {
//     const nueva = this.repo.create({ ...dto, estandar_id: estandarId });
//     return this.repo.save(nueva);
//   }

//   async actualizar(id: number, dto: UpdatePriorizacionDto) {
//     const registro = await this.repo.findOneBy({ id });
//     if (!registro) throw new NotFoundException('Priorización no encontrada');
//     Object.assign(registro, dto);
//     return this.repo.save(registro);
//   }

//   eliminar(id: number) {
//     return this.repo.delete(id);
//   }

//   listarPorAutoevaluacion(autoevaluacionId: number) {
//     return this.repo.find({ where: { autoevaluacion_id: autoevaluacionId } });
//   }
// }
