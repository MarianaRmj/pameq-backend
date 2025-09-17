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
import { UpdateCalificacionDto } from './dto/UpdateCalificacionDto';

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

  // ==============================================================
  // Helpers
  // ==============================================================

  private ensureArray<T>(arr?: T[]): T[] {
    return Array.isArray(arr) ? arr : [];
  }

  private ensureIndex(arr: unknown[], index: number) {
    if (index < 0 || index >= arr.length) {
      throw new BadRequestException('Índice fuera de rango');
    }
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

  private async getOrCreateCualitativa(
    estandarId: number,
    autoevaluacionId: number,
  ) {
    let row = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });
    if (!row) {
      row = this.cualitativaRepo.create({
        estandarId,
        autoevaluacionId,
        fortalezas: [],
        oportunidades_mejora: [],
        efecto_oportunidades: [],
        acciones_mejora: [],
        limitantes_acciones: [],
      });
      row = await this.cualitativaRepo.save(row);
    } else {
      row.fortalezas ??= [];
      row.oportunidades_mejora ??= [];
      row.efecto_oportunidades ??= [];
      row.acciones_mejora ??= [];
      row.limitantes_acciones ??= [];
    }
    return row;
  }

  // 🔧 Genérico: manejar arrays (fortalezas, oportunidades, etc.)
  private async updateArrayField(
    estandarId: number,
    autoevaluacionId: number,
    field: keyof EvaluacionCualitativaEstandar,
    action: 'add' | 'edit' | 'delete',
    payload: { text?: string; index?: number; value?: string },
  ): Promise<{ [key: string]: string[] }> {
    const row = await this.getOrCreateCualitativa(estandarId, autoevaluacionId);

    const arr = Array.isArray(row[field]) ? [...(row[field] as string[])] : [];

    switch (action) {
      case 'add':
        if (payload.text) arr.push(payload.text.trim());
        break;
      case 'edit':
        if (payload.index == null)
          throw new BadRequestException('Debe enviar index');
        this.ensureIndex(arr, payload.index);
        arr[payload.index] = payload.text?.trim() ?? arr[payload.index];
        break;
      case 'delete': {
        const i = this.resolveIndexByValueOrIndex(arr, payload);
        arr.splice(i, 1);
        break;
      }
    }

    (row[field] as string[]) = arr;
    const saved = await this.cualitativaRepo.save(row);

    return { [field]: saved[field] as string[] };
  }

  // ==============================================================
  // Calificaciones
  // ==============================================================

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
      ...dto,
    });

    return this.calificacionRepo.save(calificacion);
  }

  // ==============================================================
  // Evaluación cualitativa completa (guardar hoja)
  // ==============================================================

  async registrarEvaluacionCualitativa(
    estandarId: number,
    dto: CreateEvaluacionCualitativaDto,
  ) {
    const autoevaluacionId = dto.autoevaluacionId;

    let existing = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });

    if (!existing) {
      existing = this.cualitativaRepo.create({
        estandarId,
        autoevaluacionId,
        fortalezas: dto.fortalezas ?? [],
        oportunidades_mejora: dto.oportunidades_mejora ?? [],
        efecto_oportunidades: dto.efecto_oportunidades ?? [],
        acciones_mejora: dto.acciones_mejora ?? [],
        limitantes_acciones: dto.limitantes_acciones ?? [],
      });
    } else {
      if (hasKey(dto, 'fortalezas')) {
        existing.fortalezas = dto.fortalezas ?? existing.fortalezas ?? [];
      }
      if (hasKey(dto, 'oportunidades_mejora')) {
        existing.oportunidades_mejora =
          dto.oportunidades_mejora ?? existing.oportunidades_mejora ?? [];
      }
      if (hasKey(dto, 'efecto_oportunidades')) {
        existing.efecto_oportunidades =
          dto.efecto_oportunidades ?? existing.efecto_oportunidades ?? [];
      }
      if (hasKey(dto, 'acciones_mejora')) {
        existing.acciones_mejora =
          dto.acciones_mejora ?? existing.acciones_mejora ?? [];
      }
      if (hasKey(dto, 'limitantes_acciones')) {
        existing.limitantes_acciones =
          dto.limitantes_acciones ?? existing.limitantes_acciones ?? [];
      }
    }

    return this.cualitativaRepo.save(existing);
  }

  // ==============================================================
  // Listados y consultas
  // ==============================================================

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

  async obtenerEvaluacionCualitativa(
    estandarId: number,
    autoevaluacionId: number,
  ) {
    const row = await this.cualitativaRepo.findOne({
      where: { estandarId, autoevaluacionId },
    });
    return (
      row ?? {
        fortalezas: [],
        oportunidades_mejora: [],
        efecto_oportunidades: [],
        acciones_mejora: [],
        limitantes_acciones: [],
      }
    );
  }

  // ==============================================================
  // Fortalezas
  // ==============================================================

  addFortaleza(estandarId: number, dto: AddItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'fortalezas',
      'add',
      { text: dto.text },
    );
  }
  updateFortaleza(estandarId: number, dto: UpdateItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'fortalezas',
      'edit',
      { index: dto.index, text: dto.text },
    );
  }
  removeFortaleza(estandarId: number, dto: RemoveItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'fortalezas',
      'delete',
      { value: dto.value, index: dto.index },
    );
  }

  // ==============================================================
  // Oportunidades
  // ==============================================================

  addOportunidad(estandarId: number, dto: AddItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'oportunidades_mejora',
      'add',
      { text: dto.text },
    );
  }
  updateOportunidad(estandarId: number, dto: UpdateItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'oportunidades_mejora',
      'edit',
      { index: dto.index, text: dto.text },
    );
  }
  removeOportunidad(estandarId: number, dto: RemoveItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'oportunidades_mejora',
      'delete',
      { value: dto.value, index: dto.index },
    );
  }

  // ==============================================================
  // Efecto de Oportunidades
  // ==============================================================

  addEfecto(estandarId: number, dto: AddItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'efecto_oportunidades',
      'add',
      { text: dto.text },
    );
  }
  updateEfecto(estandarId: number, dto: UpdateItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'efecto_oportunidades',
      'edit',
      { index: dto.index, text: dto.text },
    );
  }
  removeEfecto(estandarId: number, dto: RemoveItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'efecto_oportunidades',
      'delete',
      { value: dto.value, index: dto.index },
    );
  }

  // ==============================================================
  // Acciones de Mejora
  // ==============================================================

  addAccion(estandarId: number, dto: AddItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'acciones_mejora',
      'add',
      { text: dto.text },
    );
  }
  updateAccion(estandarId: number, dto: UpdateItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'acciones_mejora',
      'edit',
      { index: dto.index, text: dto.text },
    );
  }
  removeAccion(estandarId: number, dto: RemoveItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'acciones_mejora',
      'delete',
      { value: dto.value, index: dto.index },
    );
  }

  // ==============================================================
  // Limitantes
  // ==============================================================

  addLimitante(estandarId: number, dto: AddItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'limitantes_acciones',
      'add',
      { text: dto.text },
    );
  }
  updateLimitante(estandarId: number, dto: UpdateItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'limitantes_acciones',
      'edit',
      { index: dto.index, text: dto.text },
    );
  }
  removeLimitante(estandarId: number, dto: RemoveItemDto) {
    return this.updateArrayField(
      estandarId,
      dto.autoevaluacionId,
      'limitantes_acciones',
      'delete',
      { value: dto.value, index: dto.index },
    );
  }

  // ==============================================================
  // Evaluacion cualitativa
  // ==============================================================

  async updateCuantitativa(dto: UpdateCalificacionDto) {
    const { autoevaluacionId, nombre, valor } = dto;

    const calificacion = await this.calificacionRepo.findOne({
      where: { autoevaluacionId },
    });
    if (!calificacion) {
      throw new NotFoundException(
        `No existe registro cuantitativo para la autoevaluación ${autoevaluacionId}`,
      );
    }

    // Mapeo nombre → columna
    const mapNombreToColumn: Record<string, keyof CalificacionEstandar> = {
      'SISTEMATICIDAD Y AMPLITUD': 'sistematicidad',
      PROACTIVIDAD: 'proactividad',
      'CICLOS DE EVALUACIÓN Y MEJORAMIENTO': 'ciclo_evaluacion',
      'DESPLIEGUE A LA INSTITUCIÓN': 'despliegue_institucion',
      'DESPLIEGUE AL CLIENTE INTERNO Y/O EXTERNO': 'despliegue_cliente',
      PERTINENCIA: 'pertinencia',
      CONSISTENCIA: 'consistencia',
      'AVANCE A LA MEDICIÓN': 'avance_medicion',
      TENDENCIA: 'tendencia',
      COMPARACIÓN: 'comparacion',
    };

    const columna = mapNombreToColumn[nombre];

    if (!columna) {
      throw new Error(`No se reconoce el aspecto "${nombre}"`);
    }

    (calificacion as unknown as Record<string, unknown>)[columna] = valor;

    return this.calificacionRepo.save(calificacion);
  }
}
