// src/fortalezas/fortaleza.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FortalezaEstandar } from './entities/fortaleza.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { CreateFortalezaDto } from './dto/create-fortaleza.dto';
import { UpdateFortalezaDto } from './dto/update-fortaleza.dto';

@Injectable()
export class FortalezasService {
  constructor(
    @InjectRepository(FortalezaEstandar)
    private readonly repo: Repository<FortalezaEstandar>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly evalRepo: Repository<EvaluacionCualitativaEstandar>,

    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,
  ) {}

  async create(dto: CreateFortalezaDto) {
    const evaluacion = await this.evalRepo.findOne({
      where: { id: dto.evaluacionId },
    });
    if (!evaluacion) throw new NotFoundException('Evaluación no encontrada');

    const procesos = await this.procesoRepo.find({
      where: { id: In(dto.procesosIds) },
    });

    const fortaleza = this.repo.create({
      evaluacion,
      estandar: { id: dto.estandarId } as { id: number },
      descripcion: dto.descripcion,
      procesos,
    });

    return this.repo.save(fortaleza);
  }

  async findAllByEvaluacion(evaluacionId: number) {
    return this.repo.find({
      where: { evaluacion: { id: evaluacionId } },
      relations: ['procesos'],
    });
  }

  async findAllByEvaluacionYEst(autoevaluacionId: number, estandarId: number) {
    return this.repo.find({
      where: {
        evaluacion: { autoevaluacionId },
        estandar: { id: estandarId },
      },
      relations: ['procesos'],
    });
  }

  async update(dto: UpdateFortalezaDto) {
    const fortaleza = await this.repo.findOne({
      where: { id: dto.id },
      relations: ['procesos'],
    });
    if (!fortaleza) throw new NotFoundException('Fortaleza no encontrada');

    if (dto.descripcion) fortaleza.descripcion = dto.descripcion;

    if (dto.procesosIds) {
      const procesos = await this.procesoRepo.find({
        where: { id: In(dto.procesosIds) },
      });
      fortaleza.procesos = procesos;
    }

    return this.repo.save(fortaleza);
  }

  async remove(id: number) {
    const fortaleza = await this.repo.findOne({ where: { id } });
    if (!fortaleza) throw new NotFoundException('Fortaleza no encontrada');
    return this.repo.remove(fortaleza);
  }
}
