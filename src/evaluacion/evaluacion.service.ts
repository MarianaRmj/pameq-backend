// evaluacion.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionCualitativaEstandar } from './entities/evaluacion.entity';
import { Estandar } from './entities/estandar.entity';
import { CalificacionEstandar } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { CreateEvaluacionCualitativaDto } from './dto/create-evaluacion-cualitativa.dto';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import {
  AddItemDto,
  RemoveItemDto,
  UpdateItemDto,
} from './entities/qualitative-item.dto';

function hasKey<T extends object>(obj: T, key: string | symbol): boolean {
  return !!Object.prototype.hasOwnProperty.call(obj, key as PropertyKey);
}

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

  private ensureArray<T>(arr?: T[]): T[] {
    return Array.isArray(arr) ? arr : [];
  }

  private resolveIndex(
    arr: string[],
    dto: { index?: number; value?: string },
  ): number {
    const list = this.ensureArray(arr);

    if (dto.value != null) {
      const i = list.findIndex((v) => v === dto.value);
      if (i === -1) throw new NotFoundException('Item no encontrado');
      return i;
    }

    if (dto.index == null) {
      throw new BadRequestException('Debe enviar index o value');
    }

    const i = dto.index;
    if (i < 0 || i >= list.length) {
      throw new BadRequestException('Índice fuera de rango');
    }
    return i;
  }
  // ---------- EXISTENTES ----------
  async registrarCalificacion(estandarId: number, dto: CreateCalificacionDto) {
    const estandar = await this.estandarRepo.findOne({
      where: { id: estandarId },
    });
    if (!estandar) throw new NotFoundException('Estandar no encontrado');

    const autoevaluacion = await this.autoevaluacionRepo.findOne({
      where: { id: dto.autoevaluacionId },
    });
    if (!autoevaluacion)
      throw new NotFoundException('Autoevaluación no encontrada');

    const calificacion = this.calificacionRepo.create({
      estandar,
      autoevaluacion,
      sistematicidad: dto.sistematicidad,
      proactividad: dto.proactividad,
      ciclo_evaluacion: dto.ciclo_evaluacion,
      total_enfoque: dto.total_enfoque,
      despliegue_institucion: dto.despliegue_institucion,
      despliegue_cliente: dto.despliegue_cliente,
      total_implementacion: dto.total_implementacion,
      pertinencia: dto.pertinencia,
      consistencia: dto.consistencia,
      avance_medicion: dto.avance_medicion,
      tendencia: dto.tendencia,
      comparacion: dto.comparacion,
      total_resultados: dto.total_resultados,
      total_estandar: dto.total_estandar,
      calificacion: dto.calificacion,
      observaciones: dto.observaciones,
    });

    return this.calificacionRepo.save(calificacion);
  }

  async registrarEvaluacionCualitativa(
    estandarId: number,
    dto: CreateEvaluacionCualitativaDto,
  ) {
    const autoevaluacionId = dto.autoevaluacionId;

    const existing = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });

    if (existing) {
      // 🔐 Listas: no sobrescribir con [] accidentalmente
      if (hasKey(dto, 'fortalezas')) {
        if (dto.fortalezas === null) {
          existing.fortalezas = []; // reset explícito
        } else if (Array.isArray(dto.fortalezas) && dto.fortalezas.length > 0) {
          existing.fortalezas = dto.fortalezas; // reemplazo intencional con contenido
        } // si viene [] o undefined, NO tocar
      }

      if (hasKey(dto, 'oportunidades_mejora')) {
        if (dto.oportunidades_mejora === null) {
          existing.oportunidades_mejora = [];
        } else if (
          Array.isArray(dto.oportunidades_mejora) &&
          dto.oportunidades_mejora.length > 0
        ) {
          existing.oportunidades_mejora = dto.oportunidades_mejora;
        }
      }

      // 📝 Campos de texto: actualiza solo si vienen definidos; acepta null para limpiar
      if (hasKey(dto, 'soportes_fortalezas')) {
        existing.soportes_fortalezas = dto.soportes_fortalezas ?? null;
      }
      if (hasKey(dto, 'efecto_oportunidades')) {
        existing.efecto_oportunidades = dto.efecto_oportunidades ?? null;
      }
      if (hasKey(dto, 'acciones_mejora')) {
        existing.acciones_mejora = dto.acciones_mejora ?? null;
      }
      if (hasKey(dto, 'limitantes_acciones')) {
        existing.limitantes_acciones = dto.limitantes_acciones ?? null;
      }

      return this.cualitativaRepo.save(existing);
    }

    // Si no existe, crea nueva (aquí sí aplica defaults)
    const nueva = this.cualitativaRepo.create({
      estandarId,
      autoevaluacionId,
      fortalezas: dto.fortalezas ?? [],
      oportunidades_mejora: dto.oportunidades_mejora ?? [],
      soportes_fortalezas: dto.soportes_fortalezas ?? null,
      efecto_oportunidades: dto.efecto_oportunidades ?? null,
      acciones_mejora: dto.acciones_mejora ?? null,
      limitantes_acciones: dto.limitantes_acciones ?? null,
    });
    return this.cualitativaRepo.save(nueva);
  }

  async listarPorAutoevaluacion(autoevaluacionId: number) {
    const cuantitativas = await this.calificacionRepo.find({
      where: { autoevaluacionId },
    });
    const cualitativas = await this.cualitativaRepo.find({
      where: { autoevaluacionId },
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
      where: { autoevaluacionId },
    });

    return autoevaluacion.estandares.map((est) => {
      const cal = calificaciones.find((c) => c.estandarId === est.id);
      return { ...est, calificacion: cal ?? null };
    });
  }

  async obtenerCalificacion(estandarId: number) {
    return this.calificacionRepo.findOne({ where: { estandarId } });
  }

  // ⚠️ filtra por estandarId y autoevaluacionId (clave lógica de la fila)
  async obtenerEvaluacionCualitativa(
    estandarId: number,
    autoevaluacionId: number,
  ) {
    const row = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });
    return row ?? { fortalezas: [], oportunidades_mejora: [] }; // ← ¡nunca null!
  }

  // ---------- HELPERS PRIVADOS ----------
  private async getOrCreateCualitativa(
    estandarId: number,
    autoevaluacionId: number,
  ) {
    let row = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });
    if (!row) {
      // crea con arrays vacíos (gracias al default también)
      row = this.cualitativaRepo.create({
        estandarId,
        autoevaluacionId,
        fortalezas: [],
        oportunidades_mejora: [],
      });
      row = await this.cualitativaRepo.save(row);
    } else {
      // saneo defensivo (por si hay datos antiguos nulos)
      row.fortalezas ??= [];
      row.oportunidades_mejora ??= [];
    }
    return row;
  }

  private ensureIndex(arr: unknown[], index: number) {
    if (index < 0 || index >= arr.length) {
      throw new BadRequestException('Índice fuera de rango');
    }
  }

  // ---------- FORTALEZAS ----------
  async addFortaleza(estandarId: number, dto: AddItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    row.fortalezas.push(dto.text.trim());
    const saved = await this.cualitativaRepo.save(row);
    // retorno práctico para el front: el ítem recién insertado y su index
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      index: saved.fortalezas.length - 1,
      text: dto.text.trim(),
      fortalezas: saved.fortalezas,
    };
  }

  async updateFortaleza(estandarId: number, dto: UpdateItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    this.ensureIndex(row.fortalezas, dto.index);
    row.fortalezas[dto.index] = dto.text.trim();
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      index: dto.index,
      text: dto.text.trim(),
      fortalezas: saved.fortalezas,
    };
  }

  async removeFortaleza(estandarId: number, dto: RemoveItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );

    row.fortalezas = this.ensureArray(row.fortalezas);
    const i = this.resolveIndex(row.fortalezas, dto);

    row.fortalezas.splice(i, 1);
    const saved = await this.cualitativaRepo.save(row);

    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      deletedIndex: i,
      fortalezas: saved.fortalezas,
    };
  }

  // ---------- OPORTUNIDADES ----------
  async addOportunidad(estandarId: number, dto: AddItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    row.oportunidades_mejora.push(dto.text.trim());
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      index: saved.oportunidades_mejora.length - 1,
      text: dto.text.trim(),
      oportunidades: saved.oportunidades_mejora,
    };
  }

  async updateOportunidad(estandarId: number, dto: UpdateItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    this.ensureIndex(row.oportunidades_mejora, dto.index);
    row.oportunidades_mejora[dto.index] = dto.text.trim();
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      index: dto.index,
      text: dto.text.trim(),
      oportunidades: saved.oportunidades_mejora,
    };
  }

  private norm(s: unknown) {
    return typeof s === 'string' ? s.trim().replace(/\s+/g, ' ') : '';
  }

  private resolveIndexByValueOrIndex(
    arr: string[],
    dto: { index?: number; value?: string },
  ): number {
    const list = this.ensureArray(arr);

    if (dto.value != null) {
      const target = this.norm(dto.value);
      const found = list.findIndex((v) => this.norm(v) === target);
      if (found !== -1) return found;
      throw new NotFoundException('Item no encontrado');
    }

    if (dto.index == null) {
      throw new BadRequestException('Debe enviar index o value');
    }

    const i = dto.index;
    if (i < 0 || i >= list.length) {
      throw new BadRequestException('Índice fuera de rango');
    }
    return i;
  }

  async removeOportunidad(estandarId: number, dto: RemoveItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    const arr = Array.isArray(row.oportunidades_mejora)
      ? row.oportunidades_mejora
      : [];
    const i = this.resolveIndexByValueOrIndex(arr, dto);
    arr.splice(i, 1);
    row.oportunidades_mejora = arr;
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      deletedIndex: i,
      oportunidades: saved.oportunidades_mejora,
    };
  }
}
