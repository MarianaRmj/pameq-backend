// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CalidadEsperadaEstandar } from './entities/calidad-esperada.entity';
// import { CreateCalidadEsperadaDto } from './dto/create-calidad-esperada.dto';
// import { UpdateCalidadEsperadaDto } from './dto/update-calidad-esperada.dto';

// @Injectable()
// export class CalidadEsperadaService {
//   constructor(
//     @InjectRepository(CalidadEsperadaEstandar)
//     private calidadRepo: Repository<CalidadEsperadaEstandar>,
//   ) {}

//   async create(dto: CreateCalidadEsperadaDto) {
//     const nueva = this.calidadRepo.create(dto);
//     return this.calidadRepo.save(nueva);
//   }

//   async findAll() {
//     return this.calidadRepo.find({ relations: ['priorizacion'] });
//   }

//   async findOne(id: number) {
//     const item = await this.calidadRepo.findOne({ where: { id } });
//     if (!item) throw new NotFoundException('No encontrado');
//     return item;
//   }

//   async update(id: number, dto: UpdateCalidadEsperadaDto) {
//     const calidad = await this.findOne(id);
//     Object.assign(calidad, dto);
//     return this.calidadRepo.save(calidad);
//   }

//   async remove(id: number) {
//     const calidad = await this.findOne(id);
//     return this.calidadRepo.remove(calidad);
//   }

//   async findByPriorizacion(priorizacion_id: number) {
//     return this.calidadRepo.find({ where: { priorizacion_id } });
//   }
// }
