import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionCualitativaEstandar } from './entities/evaluacion.entity';
import { Estandar } from './entities/estandar.entity';
import { CalificacionEstandar } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CreateEvaluacionCualitativaDto } from './dto/create-evaluacion-cualitativa.dto';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(CalificacionEstandar)
    private calificacionRepo: Repository<CalificacionEstandar>,
    @InjectRepository(EvaluacionCualitativaEstandar)
    private cualitativaRepo: Repository<EvaluacionCualitativaEstandar>,
    @InjectRepository(Estandar)
    private estandarRepo: Repository<Estandar>,
    @InjectRepository(Autoevaluacion)
    private autoevaluacionRepo: Repository<Autoevaluacion>,
  ) {}

  async registrarCalificacion(estandarId: number, dto: CreateCalificacionDto) {
    const estandar = await this.estandarRepo.findOne({
      where: { id: estandarId },
    });
    if (!estandar) throw new NotFoundException('Estandar no encontrado');

    const calificacion = this.calificacionRepo.create({
      ...dto,
      estandar_id: estandarId,
    });
    return this.calificacionRepo.save(calificacion);
  }

  async registrarEvaluacionCualitativa(
    estandarId: number,
    dto: CreateEvaluacionCualitativaDto,
  ) {
    const nueva = this.cualitativaRepo.create({
      estandar_id: estandarId,
      autoevaluacion_id: dto.autoevaluacionId, // ✅ Asignación manual
      fortalezas: dto.fortalezas,
      oportunidades_mejora: dto.oportunidades_mejora,
      soportes_fortalezas: dto.soportes_fortalezas,
      efecto_oportunidades: dto.efecto_oportunidades,
      acciones_mejora: dto.acciones_mejora,
      limitantes_acciones: dto.limitantes_acciones,
    });

    return this.cualitativaRepo.save(nueva);
  }

  async listarPorAutoevaluacion(autoevaluacionId: number) {
    const cuantitativas = await this.calificacionRepo.find({
      where: { autoevaluacion_id: autoevaluacionId },
    });
    const cualitativas = await this.cualitativaRepo.find({
      where: { autoevaluacion_id: autoevaluacionId },
    });
    return { cuantitativas, cualitativas };
  }

  async listarEvaluacionPorAutoevaluacion(autoevaluacionId: number) {
    const autoevaluacion = await this.autoevaluacionRepo.findOne({
      where: { id: autoevaluacionId },
      relations: ['estandares'],
    });

    if (!autoevaluacion) return [];

    const calificaciones = await this.calificacionRepo.find({
      where: { autoevaluacion_id: autoevaluacionId },
    });

    const cualitativas = await this.cualitativaRepo.find({
      where: { autoevaluacion_id: autoevaluacionId },
    });

    return autoevaluacion.estandares.map((est) => {
      const cal = calificaciones.find((c) => c.estandar_id === est.id);
      const cual = cualitativas.find((q) => q.estandar_id === est.id);
      return {
        ...est,
        calificacion: cal ?? null,
        evaluacionCualitativa: cual ?? null,
      };
    });
  }
}
