import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ScheduleTask } from './entities/schedule-task.entity';
import { CreateScheduleTaskDto } from './dto/CreateScheduleTaskDto';
import { UpdateScheduleTaskDto } from './dto/UpdateScheduleTaskDto';

// --------- Helpers a nivel módulo ----------
function toDateOrUndefined(v?: string): Date | undefined {
  if (v == null || v === '') return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

function toDateOrNull(v?: string): Date | null {
  if (v == null || v === '') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeEstado(
  input?: string,
): 'pendiente' | 'en proceso' | 'finalizado' | undefined {
  if (!input) return undefined;
  const map: Record<string, 'pendiente' | 'en proceso' | 'finalizado'> = {
    Pendiente: 'pendiente',
    Finalizado: 'finalizado',
    pendiente: 'pendiente',
    en_proceso: 'en proceso',
    finalizado: 'finalizado',
  };
  return map[input] ?? undefined;
}
// -------------------------------------------

@Injectable()
export class ScheduleTaskService {
  constructor(
    @InjectRepository(ScheduleTask)
    private readonly scheduleTaskRepo: Repository<ScheduleTask>,
  ) {}

  async create(dto: CreateScheduleTaskDto): Promise<ScheduleTask> {
    // convertir fechas (la entidad exige Date no nullable)
    const fc = toDateOrNull(dto.fecha_comienzo);
    const ff = toDateOrNull(dto.fecha_fin);
    if (!fc) throw new BadRequestException('fecha_comienzo inválida');
    if (!ff) throw new BadRequestException('fecha_fin inválida');

    const task = this.scheduleTaskRepo.create({
      ...dto,
      fecha_comienzo: fc,
      fecha_fin: ff,
      estado: normalizeEstado(dto.estado),
      predecesoras: dto.predecesoras?.trim() ? dto.predecesoras : null,
      parentId:
        (typeof dto === 'object' &&
          dto !== null &&
          'parentId' in dto &&
          (dto as { parentId?: any }).parentId === '') ||
        (dto as { parentId?: any }).parentId == null
          ? null
          : Number((dto as { parentId?: any }).parentId),
    });
    return await this.scheduleTaskRepo.save(task);
  }

  async findAll(filters: {
    cicloId?: number;
    sedeId?: number;
    institucionId?: number;
    responsable?: string;
  }): Promise<ScheduleTask[]> {
    const where: FindOptionsWhere<ScheduleTask> = {};
    if (filters.cicloId != null) where.cicloId = Number(filters.cicloId);
    if (filters.sedeId != null) where.sedeId = Number(filters.sedeId);
    if (filters.institucionId != null)
      where.institucionId = Number(filters.institucionId);
    if (filters.responsable) where.responsable = filters.responsable;

    return await this.scheduleTaskRepo.find({ where });
  }

  async findOne(id: number): Promise<ScheduleTask> {
    const task = await this.scheduleTaskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Actividad no encontrada');
    return task;
  }

  async update(id: number, dto: UpdateScheduleTaskDto): Promise<ScheduleTask> {
    const task = await this.scheduleTaskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Actividad no encontrada');

    const toAssign: Partial<ScheduleTask> = {};

    if (dto.nombre_tarea !== undefined)
      toAssign.nombre_tarea = dto.nombre_tarea;
    if (dto.duracion !== undefined) toAssign.duracion = dto.duracion;
    if (dto.responsable !== undefined) toAssign.responsable = dto.responsable;
    if (dto.progreso !== undefined) toAssign.progreso = dto.progreso;
    if (dto.observaciones !== undefined)
      toAssign.observaciones = dto.observaciones;

    // convertir string -> Date si vienen en DTO
    if (dto.fecha_comienzo !== undefined) {
      toAssign.fecha_comienzo = toDateOrUndefined(dto.fecha_comienzo);
    }
    if (dto.fecha_fin !== undefined) {
      toAssign.fecha_fin = toDateOrUndefined(dto.fecha_fin);
    }

    // normalizar estado
    if (dto.estado !== undefined) {
      toAssign.estado = normalizeEstado(dto.estado);
    }

    // normalizar predecesoras (string o null)
    if (dto.predecesoras !== undefined) {
      toAssign.predecesoras = dto.predecesoras?.trim()
        ? dto.predecesoras
        : null;
    }

    // jerarquía
    if (dto?.parentId !== undefined) {
      const v = dto.parentId;
      toAssign.parentId =
        (typeof v === 'string' && (v === '' || v === 'null')) || v == null
          ? null
          : Number(v);
    }

    // filtros opcionales
    if (dto.cicloId !== undefined) toAssign.cicloId = dto.cicloId;
    if (dto.sedeId !== undefined) toAssign.sedeId = dto.sedeId;
    if (dto.institucionId !== undefined)
      toAssign.institucionId = dto.institucionId;

    Object.assign(task, toAssign);
    return await this.scheduleTaskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleTaskRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Actividad no encontrada');
  }
}
