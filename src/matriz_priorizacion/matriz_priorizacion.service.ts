import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { PriorizacionCriterio } from './entities/priorizacion-criterio.entity';
import { PriorizacionRegistro } from './entities/priorizacion-registro.entity';

import { Proceso } from 'src/processes/entities/process.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { EstandarSeleccionado } from 'src/evaluacion/entities/estandares-seleccionados.entity';

import { FortalezaEstandar } from 'src/fortalezas/entities/fortaleza.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';

import { UpsertPriorizacionDto } from './dto/upsert-priorizacion.dto';

@Injectable()
export class MatrizPriorizacionService {
  constructor(
    @InjectRepository(PriorizacionCriterio)
    private readonly criteriosRepo: Repository<PriorizacionCriterio>,

    @InjectRepository(PriorizacionRegistro)
    private readonly regRepo: Repository<PriorizacionRegistro>,

    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,

    @InjectRepository(Estandar)
    private readonly estandarRepo: Repository<Estandar>,

    @InjectRepository(EstandarSeleccionado)
    private readonly esRepo: Repository<EstandarSeleccionado>,

    @InjectRepository(FortalezaEstandar)
    private readonly fortRepo: Repository<FortalezaEstandar>,

    @InjectRepository(OportunidadMejoraEstandar)
    private readonly opoRepo: Repository<OportunidadMejoraEstandar>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly evalRepo: Repository<EvaluacionCualitativaEstandar>,
  ) {}

  // --- Catálogo para los selects (riesgo/costo/frecuencia) ---
  async getCriterios() {
    const rows = await this.criteriosRepo.find();
    const by = (d: string) =>
      rows.filter((r) => r.dominio === d).sort((a, b) => a.valor - b.valor);
    return {
      riesgo: by('riesgo'),
      costo: by('costo'),
      frecuencia: by('frecuencia'),
    };
  }

  // --- Procesos seleccionados a nivel proceso (estandarId IS NULL) para un ciclo ---
  async getProcesosSeleccionados(cicloId: number) {
    if (!cicloId) return [];

    const rows = await this.esRepo
      .createQueryBuilder('es')
      .innerJoin('es.proceso', 'p')
      .select([
        'p.id AS id',
        // Si tu Proceso usa 'nombre' en lugar de 'nombre_proceso', cambia esta línea:
        'p.nombre_proceso AS nombre_proceso',
      ])
      .where('es.cicloId = :cicloId', { cicloId }) // usar FK explícita
      .andWhere('es.seleccionado = TRUE')
      .andWhere('es.estandarId IS NULL') // selección a nivel proceso
      .groupBy('p.id, p.nombre_proceso')
      .orderBy('p.nombre_proceso', 'ASC')
      .getRawMany();

    return rows as Array<{ id: number; nombre_proceso: string }>;
  }

  // --- Matriz: estándares seleccionados + priorización + hallazgos (fortalezas/oportunidades) ---
  async listMatriz(procesoId: number, cicloId?: number) {
    // 1) Validar que el proceso esté seleccionado a nivel proceso (estandar NULL)
    const procesoMarcado = await this.esRepo.findOne({
      where: {
        proceso: { id: procesoId },
        seleccionado: true,
        estandar: IsNull(), // relación null
        ...(cicloId ? { ciclo: { id: cicloId } } : {}),
      },
      relations: { proceso: true, ciclo: !!cicloId },
    });
    if (!procesoMarcado) {
      throw new ForbiddenException(
        'El proceso no está seleccionado para este ciclo.',
      );
    }

    // 2) Estándares seleccionados (estandar NOT NULL) + priorización (LEFT JOIN)
    const qb = this.esRepo
      .createQueryBuilder('es')
      .innerJoin('es.estandar', 'e')
      .leftJoin(
        PriorizacionRegistro,
        'pr',
        // pr.* son columnas físicas snake_case; es.* son FKs generadas por TypeORM (camelCase)
        'pr.proceso_id = es.procesoId AND pr.estandar_id = es.estandarId',
      )
      .where('es.procesoId = :pid', { pid: procesoId })
      .andWhere('es.seleccionado = TRUE')
      .andWhere('es.estandarId IS NOT NULL');

    if (cicloId) {
      qb.andWhere('es.cicloId = :cicloId', { cicloId });
    }

    qb.select([
      'e.id AS estandar_id',
      'e.codigo AS codigo',
      'e.descripcion AS descripcion',
      'pr.id AS registro_id',
      'pr.riesgo AS riesgo',
      'pr.costo AS costo',
      'pr.frecuencia AS frecuencia',
      'pr.total AS total',
      'pr.confirmado AS confirmado',
    ]).orderBy('e.codigo', 'ASC');

    const baseRows = await qb.getRawMany<{
      estandar_id: number;
      codigo: string;
      descripcion: string;
      registro_id: number | null;
      riesgo: 1 | 3 | 5 | null;
      costo: 1 | 3 | 5 | null;
      frecuencia: 1 | 3 | 5 | null;
      total: number | null;
      confirmado: boolean | null;
    }>();

    if (!baseRows.length) return [];

    const estIds = baseRows.map((r) => r.estandar_id);

    // 3) Fortalezas vinculadas a (ciclo, proceso, estándar)
    const fortQB = this.fortRepo
      .createQueryBuilder('f')
      .innerJoin('f.estandar', 'e')
      .innerJoin('f.procesos', 'p') // m2m (tabla fortalezas_procesos)
      .innerJoin('f.evaluacion', 'ev')
      .where('p.id = :procesoId', { procesoId })
      .andWhere('e.id IN (:...estIds)', { estIds });
    if (cicloId) {
      // si tu FK en Evaluacion es snake_case, usa ev.ciclo_id
      fortQB.andWhere('ev.cicloId = :cicloId', { cicloId });
    }
    fortQB.select(['e.id AS estandar_id', 'f.descripcion AS texto']);
    const fortRows = await fortQB.getRawMany<{
      estandar_id: number;
      texto: string;
    }>();

    // 4) Oportunidades vinculadas a (ciclo, proceso, estándar)
    const opoQB = this.opoRepo
      .createQueryBuilder('o')
      .innerJoin('o.estandar', 'e')
      .innerJoin('o.procesos', 'p') // m2m (tabla oportunidades_procesos)
      .innerJoin('o.evaluacion', 'ev')
      .where('p.id = :procesoId', { procesoId })
      .andWhere('e.id IN (:...estIds)', { estIds });
    if (cicloId) {
      // si tu FK en Evaluacion es snake_case, usa ev.ciclo_id
      opoQB.andWhere('ev.cicloId = :cicloId', { cicloId });
    }
    opoQB.select(['e.id AS estandar_id', 'o.descripcion AS texto']);
    const opoRows = await opoQB.getRawMany<{
      estandar_id: number;
      texto: string;
    }>();

    // 5) Mapear hallazgos por estándar
    const fortMap = new Map<number, string[]>();
    const opoMap = new Map<number, string[]>();
    for (const id of estIds) {
      fortMap.set(id, []);
      opoMap.set(id, []);
    }
    for (const f of fortRows) fortMap.get(f.estandar_id)!.push(f.texto);
    for (const o of opoRows) opoMap.get(o.estandar_id)!.push(o.texto);

    // 6) Respuesta final
    return baseRows.map((r) => ({
      estandar_id: r.estandar_id,
      codigo: r.codigo,
      descripcion: r.descripcion,
      registro_id: r.registro_id,
      riesgo: r.riesgo,
      costo: r.costo,
      frecuencia: r.frecuencia,
      total: r.total,
      confirmado: !!r.confirmado,
      fortalezas: fortMap.get(r.estandar_id) ?? [],
      oportunidades: opoMap.get(r.estandar_id) ?? [],
    }));
  }

  // --- Crear/actualizar priorización (guarda 1/3/5 y recalcula total) ---
  async upsert(dto: UpsertPriorizacionDto) {
    const [proceso, estandar] = await Promise.all([
      this.procesoRepo.findOne({ where: { id: dto.procesoId } }),
      this.estandarRepo.findOne({ where: { id: dto.estandarId } }),
    ]);
    if (!proceso) throw new NotFoundException('Proceso no encontrado');
    if (!estandar) throw new NotFoundException('Estandar no encontrado');

    // (Opcional) aquí puedes validar que el estándar esté seleccionado para ese proceso/ciclo si agregas cicloId al DTO.

    let reg = await this.regRepo.findOne({
      where: {
        proceso: { id: dto.procesoId },
        estandar: { id: dto.estandarId },
      },
    });

    const total = dto.riesgo * dto.costo * dto.frecuencia;

    if (!reg) {
      reg = this.regRepo.create({
        // referencias "ligeras" sin volver a cargar
        proceso: { id: dto.procesoId } as Proceso,
        estandar: { id: dto.estandarId } as Estandar,
        riesgo: dto.riesgo,
        costo: dto.costo,
        frecuencia: dto.frecuencia,
        total,
      });
    } else {
      reg.riesgo = dto.riesgo;
      reg.costo = dto.costo;
      reg.frecuencia = dto.frecuencia;
      reg.total = total;
    }
    return this.regRepo.save(reg);
  }

  // --- Confirmar fila ---
  async confirmar(registroId: number, confirmado = true) {
    await this.regRepo.update(registroId, { confirmado });
    return this.regRepo.findOne({ where: { id: registroId } });
  }
}
