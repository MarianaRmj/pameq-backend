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
    // create simple (dejas esta ruta para bulk create/replace si lo usas)
    const nueva = this.cualitativaRepo.create({
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      fortalezas: dto.fortalezas ?? [],
      oportunidades_mejora: dto.oportunidades_mejora ?? [],
      soportes_fortalezas: dto.soportes_fortalezas,
      efecto_oportunidades: dto.efecto_oportunidades,
      acciones_mejora: dto.acciones_mejora,
      limitantes_acciones: dto.limitantes_acciones,
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
    this.ensureIndex(row.fortalezas, dto.index);
    row.fortalezas.splice(dto.index, 1);
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      deletedIndex: dto.index,
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

  async removeOportunidad(estandarId: number, dto: RemoveItemDto) {
    const row = await this.getOrCreateCualitativa(
      estandarId,
      dto.autoevaluacionId,
    );
    this.ensureIndex(row.oportunidades_mejora, dto.index);
    row.oportunidades_mejora.splice(dto.index, 1);
    const saved = await this.cualitativaRepo.save(row);
    return {
      estandarId,
      autoevaluacionId: dto.autoevaluacionId,
      deletedIndex: dto.index,
      oportunidades: saved.oportunidades_mejora,
    };
  }
}
