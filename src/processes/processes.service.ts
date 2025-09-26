// src/processes/processes.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proceso } from './entities/process.entity';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SelectProcessDto } from './dto/select-process.dto';

import { Institution } from 'src/institutions/entities/institution.entity';
import { IndicadorProceso } from './entities/indicador-proceso.entity';

import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

import { SeleccionProceso } from './entities/SeleccionProceso.entity';

import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { CicloEstado } from 'src/cycles/enums/ciclo-estado.enum';

// 4) Upsert por (ciclo activo, proceso [, estandar])
import { IsNull } from 'typeorm';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,

    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,

    @InjectRepository(IndicadorProceso)
    private readonly indicadorRepo: Repository<IndicadorProceso>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly cualitativaRepo: Repository<EvaluacionCualitativaEstandar>,

    @InjectRepository(SeleccionProceso)
    private readonly seleccionRepo: Repository<SeleccionProceso>,

    @InjectRepository(Estandar)
    private readonly estandarRepo: Repository<Estandar>,

    @InjectRepository(OportunidadMejoraEstandar)
    private readonly oportunidadRepo: Repository<OportunidadMejoraEstandar>,

    @InjectRepository(Ciclo)
    private readonly cicloRepo: Repository<Ciclo>,
  ) {}

  // =========================================================
  // Helpers
  // =========================================================

  /** Obtiene el ciclo ACTIVO global vigente para la fecha actual. */
  private async findActiveGlobalCycleOrFail(): Promise<Ciclo> {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const ciclo = await this.cicloRepo
      .createQueryBuilder('c')
      .where('c.estado = :estado', { estado: CicloEstado.ACTIVO })
      .andWhere(':today BETWEEN c.fecha_inicio AND c.fecha_fin', { today })
      .getOne();

    if (!ciclo) {
      throw new NotFoundException('No hay ciclo activo vigente.');
    }
    return ciclo;
  }

  // =========================================================
  // CRUD de Procesos
  // =========================================================

  async findAll(): Promise<Proceso[]> {
    return this.procesoRepo.find();
  }

  async create(data: CreateProcessDto) {
    const institution = await this.institutionRepo.findOne({
      where: { id: data.institutionId },
    });
    if (!institution) {
      throw new NotFoundException(
        `Institución con ID ${data.institutionId} no encontrada.`,
      );
    }

    const indicadores = (data.indicadores || []).map((i) =>
      this.indicadorRepo.create({ nombre: i.nombre }),
    );

    const proceso = this.procesoRepo.create({
      nombre_proceso: data.nombre_proceso,
      descripcion: data.descripcion,
      lider: data.lider,
      numero_integrantes: Number(data.numero_integrantes),
      institution,
      indicadores, // se guarda en cascada
    });

    return this.procesoRepo.save(proceso);
  }

  async update(id: number, data: UpdateProcessDto) {
    const proceso = await this.procesoRepo.findOne({
      where: { id },
      relations: ['institution', 'indicadores'],
    });
    if (!proceso) {
      throw new NotFoundException(`Proceso con ID ${id} no encontrado.`);
    }

    // Cambiar institución si viene en el DTO
    if (data.institutionId) {
      const institution = await this.institutionRepo.findOne({
        where: { id: data.institutionId },
      });
      if (!institution) {
        throw new NotFoundException(
          `Institución con ID ${data.institutionId} no encontrada.`,
        );
      }
      proceso.institution = institution;
    }

    // Reemplazo de indicadores (soft delete + nuevos)
    if (data.indicadores) {
      await this.indicadorRepo.softRemove(proceso.indicadores || []);
      const nuevosIndicadores = data.indicadores.map((i) =>
        this.indicadorRepo.create({ nombre: i.nombre, proceso }),
      );
      proceso.indicadores = nuevosIndicadores;
    }

    Object.assign(proceso, data);
    return this.procesoRepo.save(proceso);
  }

  async remove(id: number) {
    const proceso = await this.procesoRepo.findOne({
      where: { id },
      relations: ['ciclos'],
    });
    if (!proceso) {
      throw new NotFoundException(`Proceso con ID ${id} no encontrado.`);
    }
    if (proceso.ciclos && proceso.ciclos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el proceso porque tiene ciclos asociados.',
      );
    }
    await this.procesoRepo.remove(proceso);
    return { message: 'Proceso eliminado correctamente' };
  }

  // =========================================================
  // Recuento de Oportunidades por Proceso (por ciclo)
  // =========================================================

  async contarOportunidadesPorProceso(cicloId: number) {
    // --- A) Por relación Many-to-Many: Oportunidad <-> Proceso
    const mm = await this.oportunidadRepo
      .createQueryBuilder('op')
      .innerJoin('op.evaluacion', 'eval')
      .innerJoin('eval.autoevaluacion', 'auto')
      .innerJoin('op.procesos', 'proceso') // M2M explícita
      .where('auto.ciclo = :cicloId', { cicloId }) // FK real en autoevaluaciones
      .select('proceso.id', 'id')
      .addSelect('proceso.nombre_proceso', 'proceso')
      .addSelect('COUNT(op.id)', 'oportunidades')
      .groupBy('proceso.id')
      .addGroupBy('proceso.nombre_proceso')
      .orderBy('oportunidades', 'DESC')
      .getRawMany<{ id: string; proceso: string; oportunidades: string }>();

    // --- B) Por Proceso del Estándar: Evaluación -> Estandar -> Proceso
    const byStd = await this.oportunidadRepo
      .createQueryBuilder('op')
      .innerJoin('op.evaluacion', 'eval')
      .innerJoin('eval.autoevaluacion', 'auto')
      .innerJoin('eval.estandar', 'estandar')
      .innerJoin('estandar.proceso', 'procesoE')
      .where('auto.ciclo = :cicloId', { cicloId })
      .select('procesoE.id', 'id')
      .addSelect('procesoE.nombre_proceso', 'proceso')
      .addSelect('COUNT(op.id)', 'oportunidades')
      .groupBy('procesoE.id')
      .addGroupBy('procesoE.nombre_proceso')
      .orderBy('oportunidades', 'DESC')
      .getRawMany<{ id: string; proceso: string; oportunidades: string }>();

    // --- C) Fusionar ambos recuentos (sumar por proceso)
    const acc = new Map<
      number,
      { id: number; proceso: string; oportunidades: number }
    >();

    const addAll = (
      rows: { id: string; proceso: string; oportunidades: string }[],
    ) => {
      for (const r of rows) {
        const id = Number(r.id);
        const current = acc.get(id);
        const extra = Number(r.oportunidades);
        if (current) {
          current.oportunidades += extra;
        } else {
          acc.set(id, { id, proceso: r.proceso, oportunidades: extra });
        }
      }
    };

    addAll(mm);
    addAll(byStd);

    // Ordenar por oportunidades desc como antes
    return Array.from(acc.values()).sort(
      (a, b) => b.oportunidades - a.oportunidades,
    );
  }

  async guardarSeleccion(dto: SelectProcessDto) {
    const { procesoId, estandarId, usuarioId, seleccionado, observaciones } =
      dto;

    // 1) Proceso
    const proceso = await this.procesoRepo.findOne({
      where: { id: procesoId },
    });
    if (!proceso) throw new NotFoundException('El proceso no existe');

    // 2) Ciclo ACTIVO global
    const ciclo = await this.findActiveGlobalCycleOrFail();

    // 3) Estandar (opcional)
    let estandar: Estandar | null = null;
    if (estandarId != null) {
      estandar = await this.estandarRepo.findOne({ where: { id: estandarId } });
      if (!estandar) throw new NotFoundException('El estándar no existe');
    }

    const whereClause = estandar
      ? {
          proceso: { id: procesoId },
          ciclo: { id: ciclo.id },
          estandar: { id: estandar.id },
        }
      : {
          proceso: { id: procesoId },
          ciclo: { id: ciclo.id },
          estandar: IsNull(),
        };

    const existing = await this.seleccionRepo.findOne({
      where: whereClause,
    });

    if (existing) {
      existing.seleccionado = seleccionado;
      existing.usuario_id = usuarioId;
      existing.observaciones =
        observaciones ?? existing.observaciones ?? undefined;
      return this.seleccionRepo.save(existing);
    }

    const nuevo = this.seleccionRepo.create({
      proceso,
      ciclo,
      estandar: estandar ?? undefined,
      usuario_id: usuarioId,
      seleccionado,
      observaciones: observaciones ?? undefined,
    });
    return this.seleccionRepo.save(nuevo);
  }

  /**
   * Lista selecciones por ciclo (útil para pintar el estado guardado).
   * Nota: este endpoint recibe un cicloId explícito solo para consultar.
   */
  async listarSeleccionadosPorCiclo(cicloId: number) {
    const selecciones = await this.seleccionRepo
      .createQueryBuilder('sel')
      .leftJoinAndSelect('sel.proceso', 'proceso')
      .leftJoin('sel.ciclo', 'ciclo')
      .where('ciclo.id = :cicloId', { cicloId })
      .getMany();

    return selecciones.map((s) => ({
      id: s.id,
      proceso: {
        id: s.proceso.id,
        nombre_proceso: s.proceso.nombre_proceso,
      },
      seleccionado: s.seleccionado,
      observaciones: s.observaciones,
      usuario_id: s.usuario_id,
    }));
  }
}
