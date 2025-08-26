// src/autoevaluacion/autoevaluacion.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autoevaluacion } from './entities/autoevaluacion.entity';
import { CreateAutoevaluacionDto } from './dto/create-autoevaluacion.dto';

@Injectable()
export class AutoevaluacionService {
  constructor(
    @InjectRepository(Autoevaluacion)
    private readonly autoRepo: Repository<Autoevaluacion>,
  ) {}

  async crear(dto: CreateAutoevaluacionDto) {
    const nueva = this.autoRepo.create(dto);
    return this.autoRepo.save(nueva);
  }

  async listarPorCiclo(ciclo: string) {
    return this.autoRepo.find({ where: { ciclo }, order: { id: 'DESC' } });
  }
}
