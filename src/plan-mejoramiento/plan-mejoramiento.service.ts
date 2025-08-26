// src/plan-mejoramiento/plan-mejoramiento.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanMejoramientoAccion } from './entities/plan-mejoramiento-accion.entity';
import { CreateAccionDto } from './dto/create-accion.dto';
import { UpdateAccionDto } from './dto/update-accion.dto';
import { PriorizacionEstandar } from 'src/priorizacion/entities/priorizacion.entity';

@Injectable()
export class PlanMejoramientoService {
  constructor(
    @InjectRepository(PlanMejoramientoAccion)
    private readonly accionRepo: Repository<PlanMejoramientoAccion>,

    @InjectRepository(PriorizacionEstandar)
    private readonly priorizacionRepo: Repository<PriorizacionEstandar>,
  ) {}

  async create(priorizacionId: number, dto: CreateAccionDto) {
    const priorizacion = await this.priorizacionRepo.findOneBy({
      id: priorizacionId,
    });
    if (!priorizacion)
      throw new NotFoundException('Priorización no encontrada');

    const accion = this.accionRepo.create({
      ...dto,
      priorizacion_id: priorizacionId,
      estado: 'Pendiente',
      avance: 0,
      fecha_creacion: new Date(),
    });

    return this.accionRepo.save(accion);
  }

  async findByPriorizacion(priorizacionId: number) {
    return this.accionRepo.find({
      where: { priorizacion_id: priorizacionId },
      order: { fecha_inicio: 'ASC' },
    });
  }

  async findOne(id: number) {
    const accion = await this.accionRepo.findOne({ where: { id } });
    if (!accion) throw new NotFoundException('Acción no encontrada');
    return accion;
  }

  async update(id: number, dto: UpdateAccionDto) {
    const accion = await this.accionRepo.findOneBy({ id });
    if (!accion) throw new NotFoundException('Acción no encontrada');

    const actualizada = this.accionRepo.merge(accion, dto);
    return this.accionRepo.save(actualizada);
  }

  async remove(id: number) {
    const accion = await this.accionRepo.findOneBy({ id });
    if (!accion) throw new NotFoundException('Acción no encontrada');
    return this.accionRepo.remove(accion);
  }
}
