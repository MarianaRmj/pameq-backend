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

// Canon EXACTO que debe existir en la BD (enum cronograma_estado_enum)
export type EstadoCanon = 'pendiente' | 'en_curso' | 'finalizado';

const ESTADO_MAP: Record<string, EstadoCanon> = {
  // variantes "humanas"
  pendiente: 'pendiente',
  'en curso': 'en_curso',
  'en proceso': 'en_curso',
  'en progreso': 'en_curso',

  // variantes con guion/underscore
  en_curso: 'en_curso',
  en_proceso: 'en_curso',
  en_progreso: 'en_curso',

  // opcionales (palabra suelta)
  curso: 'en_curso',
  proceso: 'en_curso',
  progreso: 'en_curso',

  // finalizado (acepta femenino)
  finalizado: 'finalizado',
  finalizada: 'finalizado',
};

export function normalizeEstado(
  input?: string,
  def?: EstadoCanon,
): EstadoCanon | undefined {
  if (!input) return def;
  const s = String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // quita tildes
    .replace(/[_-]+/g, ' ') // unifica _ y - a espacio
    .trim()
    .replace(/\s+/g, ' '); // colapsa espacios
  return ESTADO_MAP[s] ?? def;
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
      // ✅ siempre guardamos el canon de BD (snake_case)
      estado: normalizeEstado(dto.estado, 'pendiente'),
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

    // ✅ normalizar estado a canon BD (sin espacios)
    if (dto.estado !== undefined) {
      const normalized = normalizeEstado(dto.estado);
      if (!normalized) throw new BadRequestException('estado inválido');
      toAssign.estado = normalized; // 'pendiente' | 'en_curso' | 'finalizado'
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
