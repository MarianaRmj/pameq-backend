// src/oportunidades/oportunidad-mejora.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OportunidadMejoraEstandar } from './entities/oportunidad-mejora.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { CreateOportunidadDto } from './dto/create-oportunidad-mejora.dto';
import { UpdateOportunidadDto } from './dto/update-oportunidad-mejora.dto';

@Injectable()
export class OportunidadesService {
  constructor(
    @InjectRepository(OportunidadMejoraEstandar)
    private readonly repo: Repository<OportunidadMejoraEstandar>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly evalRepo: Repository<EvaluacionCualitativaEstandar>,

    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,
  ) {}

  async create(dto: CreateOportunidadDto) {
    const evaluacion = await this.evalRepo.findOne({
      where: { id: dto.evaluacionId },
    });
    if (!evaluacion) throw new NotFoundException('Evaluación no encontrada');

    const procesos = await this.procesoRepo.find({
      where: { id: In(dto.procesosIds) },
    });

    const oportunidad = this.repo.create({
      evaluacion,
      descripcion: dto.descripcion,
      procesos,
    });

    return this.repo.save(oportunidad);
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
        evaluacion: { autoevaluacionId, estandarId },
      },
      relations: ['procesos'],
    });
  }

  async update(dto: UpdateOportunidadDto) {
    const oportunidad = await this.repo.findOne({
      where: { id: dto.id },
      relations: ['procesos'],
    });
    if (!oportunidad) throw new NotFoundException('Oportunidad no encontrada');

    if (dto.descripcion) oportunidad.descripcion = dto.descripcion;

    if (dto.procesosIds) {
      const procesos = await this.procesoRepo.find({
        where: { id: In(dto.procesosIds) },
      });
      oportunidad.procesos = procesos;
    }

    return this.repo.save(oportunidad);
  }

  async remove(id: number) {
    const oportunidad = await this.repo.findOne({ where: { id } });
    if (!oportunidad) throw new NotFoundException('Oportunidad no encontrada');
    return this.repo.remove(oportunidad);
  }
}
