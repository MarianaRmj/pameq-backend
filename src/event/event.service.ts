// src/events/event.service.ts (o events.service.ts)
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Feed para FullCalendar
export type CalendarEventDto = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, unknown>;
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  // ---------- CREATE con mapeo (inglés/español) ----------
  async create(dto: CreateEventDto): Promise<Event> {
    const anyDto = dto as Partial<CreateEventDto> & {
      titulo?: string;
      descripcion?: string;
      inicio?: string | Date;
      fin?: string | Date;
      tipo?: string;
      userId?: number;
      cicloId?: number;
      title?: string; // add title as optional
      start?: string | Date;
      end?: string | Date;
    };

    const titulo = anyDto.titulo ?? anyDto.title;
    const descripcion = anyDto.descripcion ?? null;
    const inicioRaw = anyDto.inicio ?? anyDto.start;
    const finRaw = anyDto.fin ?? anyDto.end;
    const tipo = anyDto.tipo ?? 'manual';

    if (!titulo || !inicioRaw || !finRaw) {
      throw new BadRequestException('titulo, inicio y fin son obligatorios');
    }

    const event = this.eventRepo.create({
      titulo: titulo,
      descripcion: descripcion,
      inicio: new Date(inicioRaw),
      fin: new Date(finRaw),
      tipo: tipo,
      userId: anyDto.userId ?? dto.userId, // requerido por tu entidad
      cicloId: anyDto.cicloId ?? dto.cicloId ?? null,
      // refType/refId quedan null para eventos manuales
    } as Partial<Event>);

    return this.eventRepo.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepo.find({ relations: ['user', 'ciclo'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['user', 'ciclo'],
    });
    if (!event) throw new NotFoundException(`Event with id ${id} not found`);
    return event;
  }

  // ---------- UPDATE con mapeo (inglés/español) ----------
  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    const existing = await this.findOne(id);

    const anyDto = dto as Partial<UpdateEventDto> & {
      titulo?: string;
      descripcion?: string;
      inicio?: string | Date;
      fin?: string | Date;
      tipo?: string;
      userId?: number;
      cicloId?: number;
      title?: string;
      start?: string | Date;
      end?: string | Date;
      description?: string;
      type?: string;
    };
    const titulo = anyDto.titulo ?? anyDto.title ?? existing.titulo;
    const descripcion =
      anyDto.descripcion ?? anyDto.description ?? existing.descripcion;
    const inicioRaw = anyDto.inicio ?? anyDto.start ?? existing.inicio;
    const finRaw = anyDto.fin ?? anyDto.end ?? existing.fin;
    const tipo = anyDto.tipo ?? anyDto.type ?? existing.tipo;
    const userId = anyDto.userId ?? dto.userId ?? existing.userId;
    const cicloId = anyDto.cicloId ?? dto.cicloId ?? existing.cicloId;

    await this.eventRepo.update(id, {
      titulo,
      descripcion,
      inicio: new Date(inicioRaw),
      fin: new Date(finRaw),
      tipo,
      userId,
      cicloId: cicloId !== undefined ? cicloId : undefined,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepo.delete(id);
  }

  // ---------- helpers por referencia (actividad) ----------
  async findByRef(refType: 'activity', refId: number) {
    return this.eventRepo.findOne({ where: { refType, refId } });
  }

  async upsertFromActivity(a: {
    id: number;
    nombre_actividad: string;
    descripcion?: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    responsableId: number;
    cicloId?: number;
    estado: 'programada' | 'en_proceso' | 'finalizada' | 'cancelada';
    lugar?: string;
  }) {
    const existing = await this.findByRef('activity', a.id);
    const data: Partial<Event> = {
      titulo: a.nombre_actividad,
      descripcion: a.descripcion ?? '',
      inicio: a.fecha_inicio,
      fin: a.fecha_fin,
      tipo: 'actividad',
      refType: 'activity',
      refId: a.id,
      userId: a.responsableId,
      cicloId: a.cicloId,
    };
    if (existing) {
      await this.eventRepo.update(existing.id, data);
      return this.findOne(existing.id);
    }
    return this.eventRepo.save(this.eventRepo.create(data));
  }

  async deleteByRef(refType: 'activity', refId: number) {
    const existing = await this.findByRef(refType, refId);
    if (existing) await this.eventRepo.delete(existing.id);
  }

  // ---------- feed para FullCalendar con rango ----------
  private estadoColors(estado?: string) {
    switch (estado) {
      case 'en_proceso':
        return {
          backgroundColor: '#FFF7E6',
          borderColor: '#B97800',
          textColor: '#7a4b00',
        };
      case 'finalizada':
        return {
          backgroundColor: '#EEF2F7',
          borderColor: '#64748B',
          textColor: '#334155',
        };
      case 'cancelada':
        return {
          backgroundColor: '#FDECEC',
          borderColor: '#E11D48',
          textColor: '#7F1D1D',
        };
      default:
        return {
          backgroundColor: '#EAF8F2',
          borderColor: '#2C5959',
          textColor: '#143535',
        }; // programada/otros
    }
  }

  async feed(start?: string, end?: string): Promise<CalendarEventDto[]> {
    const from = start ? new Date(start) : new Date(Date.now() - 7 * 864e5);
    const to = end ? new Date(end) : new Date(Date.now() + 60 * 864e5);

    const rows = await this.eventRepo
      .createQueryBuilder('e')
      .where('e.fin >= :from', { from })
      .andWhere('e.inicio <= :to', { to })
      .orderBy('e.inicio', 'ASC')
      .getMany();

    return rows.map((e) => ({
      id: `event:${e.id}`,
      title: e.titulo,
      start: e.inicio.toISOString(),
      end: e.fin.toISOString(),
      ...(e.tipo === 'actividad'
        ? this.estadoColors(/* si guardas estado, pásalo aquí */)
        : {}),
      extendedProps: {
        tipo: e.tipo,
        description: e.descripcion ?? '', // 👈 para tu tooltip
        refType: e.refType,
        refId: e.refId,
        userId: e.userId,
        cicloId: e.cicloId,
      },
    }));
  }
}
