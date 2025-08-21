// src/activity/activity.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Process } from './entities/process.entity';
import { Evidence } from './entities/evidence.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { User } from 'src/users/entities/user.entity';
import { EventsService } from 'src/event/event.service';
import { GoogleDriveService } from 'src/storage/google-drive.service';

// Helpers para evitar "unsafe" en ESLint

function safeRemoteName(original: string) {
  const base = original
    .normalize('NFKD')
    .replace(/[^\w.\-()\s]/g, '')
    .trim();
  return base || `evidencia-${Date.now()}`;
}

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private repo: Repository<Activity>,
    @InjectRepository(Process) private processRepo: Repository<Process>,
    @InjectRepository(Evidence) private evidenceRepo: Repository<Evidence>,
    @InjectRepository(Institution) private instRepo: Repository<Institution>,
    @InjectRepository(Sede) private sedeRepo: Repository<Sede>,
    @InjectRepository(Ciclo) private cicloRepo: Repository<Ciclo>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly eventsService: EventsService,
    private readonly drive: GoogleDriveService,
  ) {}

  // helper simple
  private async mustExist<T extends import('typeorm').ObjectLiteral>(
    repo: Repository<T>,
    where: Record<string, any>,
    msg: string,
  ) {
    const exists = await repo.exist({ where });
    if (!exists) throw new BadRequestException(msg);
  }

  private ensureDates(start: Date, end: Date) {
    if (end < start) {
      throw new BadRequestException(
        'fecha_fin no puede ser anterior a fecha_inicio',
      );
    }
  }

  async create(dto: CreateActivityDto) {
    // ✔ valida fechas
    const start = new Date(dto.fecha_inicio);
    const end = new Date(dto.fecha_fin);
    this.ensureDates(start, end);

    // ✔ valida FKs antes de grabar
    await this.mustExist(
      this.instRepo,
      { id: dto.institutionId },
      'La institución no existe',
    );
    if (dto.sedeId)
      await this.mustExist(
        this.sedeRepo,
        { id: dto.sedeId },
        'La sede no existe',
      );
    if (dto.cicloId)
      await this.mustExist(
        this.cicloRepo,
        { id: dto.cicloId },
        'El ciclo no existe',
      );
    await this.mustExist(
      this.userRepo,
      { id: dto.responsableId },
      'El responsable no existe',
    );

    const activity = this.repo.create({
      ...dto,
      fecha_inicio: start,
      fecha_fin: end,
    });

    if (dto.procesosIds?.length) {
      const procesos = await this.processRepo.findBy({
        id: In(dto.procesosIds),
      });
      if (procesos.length !== dto.procesosIds.length) {
        throw new BadRequestException('Algún proceso invitado no existe');
      }
      activity.procesos_invitados = procesos;
    }

    const saved = await this.repo.save(activity);

    // 🔗 crea/actualiza evento del calendario
    await this.eventsService.upsertFromActivity({
      id: saved.id,
      nombre_actividad: saved.nombre_actividad,
      descripcion: saved.descripcion,
      fecha_inicio: saved.fecha_inicio,
      fecha_fin: saved.fecha_fin,
      responsableId: saved.responsableId,
      cicloId: saved.cicloId,
      estado: saved.estado,
      lugar: saved.lugar,
    });

    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateActivityDto) {
    const a = await this.findOne(id);

    if (dto.fecha_inicio || dto.fecha_fin) {
      const start = new Date(dto.fecha_inicio ?? a.fecha_inicio);
      const end = new Date(dto.fecha_fin ?? a.fecha_fin);
      this.ensureDates(start, end);
      a.fecha_inicio = start;
      a.fecha_fin = end;
    }

    // ✔ valida FKs sólo si vienen en el payload
    if (dto.institutionId)
      await this.mustExist(
        this.instRepo,
        { id: dto.institutionId },
        'La institución no existe',
      );
    if (dto.sedeId !== undefined)
      await this.mustExist(
        this.sedeRepo,
        { id: dto.sedeId },
        'La sede no existe',
      );
    if (dto.cicloId !== undefined)
      await this.mustExist(
        this.cicloRepo,
        { id: dto.cicloId },
        'El ciclo no existe',
      );
    if (dto.responsableId)
      await this.mustExist(
        this.userRepo,
        { id: dto.responsableId },
        'El responsable no existe',
      );

    if (dto.procesosIds) {
      const procesos = await this.processRepo.findBy({
        id: In(dto.procesosIds),
      });
      if (procesos.length !== dto.procesosIds.length) {
        throw new BadRequestException('Algún proceso invitado no existe');
      }
      a.procesos_invitados = procesos;
    }

    Object.assign(a, { ...dto, procesosIds: undefined });
    const updated = await this.repo.save(a);

    // 🔗 refleja cambios en el calendario
    await this.eventsService.upsertFromActivity({
      id: updated.id,
      nombre_actividad: updated.nombre_actividad,
      descripcion: updated.descripcion,
      fecha_inicio: updated.fecha_inicio,
      fecha_fin: updated.fecha_fin,
      responsableId: updated.responsableId,
      cicloId: updated.cicloId,
      estado: updated.estado,
      lugar: updated.lugar,
    });

    return updated;
  }

  async findAll(filters: FilterActivityDto) {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.procesos_invitados', 'p')
      .leftJoinAndSelect('a.evidencias', 'e');

    this.applyFilters(qb, filters);
    qb.orderBy('a.fecha_inicio', 'DESC');
    return qb.getMany();
  }

  private applyFilters(qb: SelectQueryBuilder<Activity>, f: FilterActivityDto) {
    if (f.institutionId)
      qb.andWhere('a.institutionId = :institutionId', {
        institutionId: f.institutionId,
      });
    if (f.sedeId) qb.andWhere('a.sedeId = :sedeId', { sedeId: f.sedeId });
    if (f.cicloId) qb.andWhere('a.cicloId = :cicloId', { cicloId: f.cicloId });
    if (f.estado) qb.andWhere('a.estado = :estado', { estado: f.estado });
    if (f.from)
      qb.andWhere('a.fecha_inicio >= :from', { from: new Date(f.from) });
    if (f.to) qb.andWhere('a.fecha_fin <= :to', { to: new Date(f.to) });
  }

  async findOne(id: number) {
    const a = await this.repo.findOne({
      where: { id },
      relations: ['evidencias', 'procesos_invitados'],
    });
    if (!a) throw new NotFoundException('Actividad no encontrada');
    return a;
  }

  async remove(id: number) {
    const a = await this.findOne(id);
    await this.repo.remove(a);
    // 🧹 borra el evento del calendario asociado
    await this.eventsService.deleteByRef('activity', id);
    return { deleted: true };
  }

  async addEvidences(activityId: number, files: unknown) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('No se enviaron archivos válidos');
    }

    const a = await this.findOne(activityId);

    // 1) Carpeta por actividad en el Drive del usuario
    const folderName =
      `ACT-${String(a.id).padStart(6, '0')} - ${a.nombre_actividad}`.slice(
        0,
        200,
      );

    // 👇 Cambia: ahora pasamos ownerUserId
    const folderId = await this.drive.ensureFolder(folderName);

    // 2) Subir cada archivo
    const uploaded: Evidence[] = [];
    for (const file of files as Express.Multer.File[]) {
      const remoteName = safeRemoteName(file.originalname);

      // 👇 Cambia: ahora pasamos ownerUserId
      const up = await this.drive.uploadBuffer({
        buffer: file.buffer,
        filename: remoteName,
        mimeType: file.mimetype,
        parentId: folderId,
      });

      uploaded.push(
        this.evidenceRepo.create({
          activityId: a.id,
          filename: up.name,
          originalName: file.originalname,
          mimeType: up.mimeType ?? file.mimetype,
          size: up.size || file.size,
          url: up.webViewLink || up.webContentLink || '',
        }),
      );
    }

    await this.evidenceRepo.save(uploaded);
    return this.findOne(activityId);
  }

  async removeEvidence(activityId: number, evidenceId: number) {
    const e = await this.evidenceRepo.findOne({
      where: { id: evidenceId, activityId },
    });
    if (!e) throw new NotFoundException('Evidencia no encontrada');
    await this.evidenceRepo.remove(e);
    return { deleted: true };
  }

  async getFormOptions(userId: number) {
    const user = (await this.userRepo.findOne({
      where: { id: userId },
      relations: ['institution'],
    })) as User & { institution?: Institution };

    if (!user || !user.institution) {
      throw new BadRequestException('Usuario o institución no válidos');
    }

    const institutionId = user.institution.id;

    const ciclo = await this.cicloRepo.findOne({
      where: { institution: { id: institutionId } },
      order: { fecha_inicio: 'DESC' },
    });

    const sedes = await this.sedeRepo.find({
      where: { institution: { id: institutionId } },
      select: ['id', 'nombre_sede'] as (keyof Sede)[],
      order: { nombre_sede: 'ASC' },
    });

    const responsables = await this.userRepo.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
      select: ['id', 'nombre'],
    });

    const procesos = await this.processRepo.find({
      select: ['id', 'nombre'],
      order: { nombre: 'ASC' },
    });

    return {
      institution: {
        id: institutionId,
        nombre: user.institution.nombre_ips,
      },
      ciclo,
      sedes,
      responsables,
      procesos,
    };
  }
}
