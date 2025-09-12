import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OportunidadMejoraEstandar } from './entities/oportunidad-mejora.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { CreateOportunidadDto } from './dto/create-oportunidad-mejora.dto';

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

    let proceso: Proceso | null = null;
    if (dto.procesoId) {
      proceso = await this.procesoRepo.findOne({
        where: { id: dto.procesoId },
      });
      if (!proceso) {
        throw new NotFoundException(
          `Proceso con ID ${dto.procesoId} no encontrado`,
        );
      }
    }

    const oportunidad = this.repo.create({
      ...(evaluacion ? { evaluacion } : {}),
      ...(proceso ? { proceso } : {}),
      descripcion: dto.descripcion,
    });

    return this.repo.save(oportunidad);
  }

  async findAllByEvaluacion(evaluacionId: number) {
    return this.repo.find({
      where: { evaluacion: { id: evaluacionId } },
      relations: ['proceso'],
    });
  }

  async remove(id: number) {
    const op = await this.repo.findOne({ where: { id } });
    if (!op) throw new NotFoundException('Oportunidad no encontrada');
    return this.repo.remove(op);
  }
}
