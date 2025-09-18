// src/autoevaluacion/autoevaluacion.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autoevaluacion } from './entities/autoevaluacion.entity';
import { CreateAutoevaluacionDto } from './dto/create-autoevaluacion.dto';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { CalificacionEstandar } from 'src/evaluacion/entities/calificacion.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';

@Injectable()
export class AutoevaluacionService {
  constructor(
    @InjectRepository(Autoevaluacion)
    private readonly autoRepo: Repository<Autoevaluacion>,

    @InjectRepository(Estandar)
    private readonly estandarRepo: Repository<Estandar>,

    @InjectRepository(CalificacionEstandar)
    private readonly calificacionRepo: Repository<CalificacionEstandar>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly cualitativaRepo: Repository<EvaluacionCualitativaEstandar>, // 👈 agregado
  ) {}

  async crear(dto: CreateAutoevaluacionDto) {
    const nueva = this.autoRepo.create(dto);
    return this.autoRepo.save(nueva);
  }

  async listarPorCiclo(ciclo: string) {
    return this.autoRepo.find({ where: { ciclo }, order: { id: 'DESC' } });
  }

  async confirmarEstandar(autoevaluacionId: number, estandarId: number) {
    const estandar = await this.estandarRepo.findOne({
      where: { id: estandarId },
    });
    if (!estandar) throw new NotFoundException('Estandar no encontrado');

    // 1. Calificación cuantitativa
    const calificacion = await this.calificacionRepo.findOne({
      where: { autoevaluacionId, estandarId },
    });
    if (!calificacion) {
      throw new NotFoundException(
        'Debe completar la calificación cuantitativa antes de confirmar',
      );
    }

    const camposCuanti: (keyof CalificacionEstandar)[] = [
      'sistematicidad',
      'proactividad',
      'ciclo_evaluacion',
      'despliegue_institucion',
      'despliegue_cliente',
      'pertinencia',
      'consistencia',
      'avance_medicion',
      'tendencia',
      'comparacion',
    ];
    const incompletosCuanti = camposCuanti.filter(
      (c) => calificacion[c] == null,
    );
    if (incompletosCuanti.length > 0) {
      throw new BadRequestException(
        `Faltan valores cuantitativos: ${incompletosCuanti.join(', ')}`,
      );
    }

    // 2. Evaluación cualitativa
    const cualitativa = await this.cualitativaRepo.findOne({
      where: { autoevaluacionId, estandarId },
    });
    if (!cualitativa) {
      throw new NotFoundException(
        'Debe registrar la evaluación cualitativa antes de confirmar',
      );
    }

    if (
      (!cualitativa.fortalezas || cualitativa.fortalezas.length === 0) &&
      (!cualitativa.efecto_oportunidades ||
        cualitativa.efecto_oportunidades.length === 0) &&
      (!cualitativa.acciones_mejora || cualitativa.acciones_mejora.length === 0)
    ) {
      throw new BadRequestException(
        'Debe registrar al menos una fortaleza, efecto u acción de mejora antes de confirmar',
      );
    }

    // 3. Confirmar
    calificacion.confirmado = true;
    return this.calificacionRepo.save(calificacion);
  }

  async estadoEstandar(autoevaluacionId: number, estandarId: number) {
    const calificacion = await this.calificacionRepo.findOne({
      where: { autoevaluacionId, estandarId },
    });

    if (!calificacion) {
      return {
        confirmado: false,
        mensaje: 'No existe calificación para este estándar',
      };
    }

    return { confirmado: !!calificacion.confirmado };
  }
}
