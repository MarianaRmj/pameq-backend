// src/autoevaluacion/autoevaluacion.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Autoevaluacion } from './entities/autoevaluacion.entity';
import { CreateAutoevaluacionDto } from './dto/create-autoevaluacion.dto';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { CalificacionEstandar } from 'src/evaluacion/entities/calificacion.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

@Injectable()
export class AutoevaluacionService {
  constructor(
    @InjectRepository(Autoevaluacion)
    private readonly autoRepo: Repository<Autoevaluacion>,

    @InjectRepository(Estandar)
    private readonly estandarRepo: Repository<Estandar>,

    @InjectRepository(OportunidadMejoraEstandar)
    private readonly oportunidadRepo: Repository<OportunidadMejoraEstandar>,

    @InjectRepository(CalificacionEstandar)
    private readonly calificacionRepo: Repository<CalificacionEstandar>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly cualitativaRepo: Repository<EvaluacionCualitativaEstandar>, // 👈 agregado

    private readonly dataSource: DataSource, // 👈 ahora sí existe
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

  async listarEstandaresConOportunidades(ciclo: string) {
    const oportunidades = await this.oportunidadRepo
      .createQueryBuilder('oportunidad')
      .innerJoinAndSelect('oportunidad.estandar', 'estandar')
      .innerJoinAndSelect('oportunidad.procesos', 'proceso')
      .innerJoin('estandar.autoevaluaciones', 'auto')
      .where('auto.ciclo = :ciclo', { ciclo })
      .getMany();

    // Agrupar por estándar
    type EstandarConOportunidades = {
      id: number;
      codigo: string;
      descripcion: string;
      oportunidades: Array<{
        id: number;
        descripcion: string;
        procesos: any; // Replace 'any' with the actual type if known
      }>;
    };

    const map = new Map<number, EstandarConOportunidades>();

    oportunidades.forEach((o) => {
      const e = o.estandar;
      if (!map.has(e.id)) {
        map.set(e.id, {
          id: e.id,
          codigo: e.codigo,
          descripcion: e.descripcion,
          oportunidades: [],
        });
      }
      const estandar = map.get(e.id)!;
      estandar.oportunidades.push({
        id: o.id,
        descripcion: o.descripcion,
        procesos: o.procesos.map((p) => ({
          id: p.id,
          nombre: p.nombre_proceso, // 👈 normalizado
        })),
      });
    });
    console.log('📦 Oportunidades agrupadas:', Array.from(map.values()));

    return Array.from(map.values());
  }
}
