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

export type EstadoCanon = 'pendiente' | 'en_curso' | 'finalizado';

export function normalizeEstado(input?: string): EstadoCanon | undefined {
  if (!input) return undefined;
  const s = input.toLowerCase().trim().replace(/\s+/g, ' '); // normaliza espacios

  const map: Record<string, EstadoCanon> = {
    // Comunes del front
    pendiente: 'pendiente',
    'en progreso': 'en_curso',
    'en proceso': 'en_curso',

    // Con guion bajo
    en_curso: 'en_curso',
    en_progreso: 'en_curso',
    en_proceso: 'en_curso',

    // Finalizado (acepta femenino por si acaso)
    finalizado: 'finalizado',
    finalizada: 'finalizado',
  };

  return map[s];
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
      estado: (() => {
        const normalized = normalizeEstado(dto.estado);
        if (normalized === 'en_curso') return 'en proceso';
        if (normalized === 'pendiente' || normalized === 'finalizado')
          return normalized;
        return undefined;
      })(),
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

    return await this.scheduleTaskRepo.find({ where, order: { id: 'ASC' } });
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
      const fc = toDateOrUndefined(dto.fecha_comienzo);
      if (!fc) throw new BadRequestException('fecha_comienzo inválida');
      toAssign.fecha_comienzo = fc;
    }
    if (dto.fecha_fin !== undefined) {
      const ff = toDateOrUndefined(dto.fecha_fin);
      if (!ff) throw new BadRequestException('fecha_fin inválida');
      toAssign.fecha_fin = ff;
    }

    // normalizar estado
    if (dto.estado !== undefined) {
      const normalizedEstado = normalizeEstado(dto.estado);
      toAssign.estado =
        normalizedEstado === 'en_curso' ? 'en proceso' : normalizedEstado;
    }

    // normalizar predecesoras (string o null)
    if (dto.predecesoras !== undefined) {
      toAssign.predecesoras = dto.predecesoras?.trim()
        ? dto.predecesoras
        : null;
    }

    // jerarquía
    if (dto?.parentId !== undefined) {
      const v = dto.parentId as unknown;
      const pid = v === '' || v === 'null' || v == null ? null : Number(v);
      if (pid !== null && Number.isNaN(pid)) {
        throw new BadRequestException('parentId inválido');
      }
      toAssign.parentId = pid;
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
