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
import * as path from 'path';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { User } from 'src/users/entities/user.entity';

// Helpers para evitar "unsafe" en ESLint
type UploadedFile = Pick<
  Express.Multer.File,
  'filename' | 'originalname' | 'mimetype' | 'size'
>;

function isUploadedFileArray(x: unknown): x is UploadedFile[] {
  return (
    Array.isArray(x) &&
    x.every(
      (f) =>
        f &&
        typeof f === 'object' &&
        'filename' in f &&
        typeof (f as { filename: unknown }).filename === 'string' &&
        'originalname' in f &&
        typeof (f as { originalname: unknown }).originalname === 'string' &&
        'mimetype' in f &&
        typeof (f as { mimetype: unknown }).mimetype === 'string' &&
        'size' in f &&
        typeof (f as { size: unknown }).size === 'number',
    )
  );
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

    return this.repo.save(activity);
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
    return this.repo.save(a);
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
    return { deleted: true };
  }

  async addEvidences(
    activityId: number,
    files: unknown,
    publicPrefix = '/uploads',
  ) {
    if (!isUploadedFileArray(files) || files.length === 0) {
      throw new BadRequestException('No se enviaron archivos válidos');
    }
    const safeFiles: UploadedFile[] = files;
    const a = await this.findOne(activityId);

    const evidences = safeFiles.map((file) =>
      this.evidenceRepo.create({
        activityId: a.id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: path.posix.join(publicPrefix, 'activities', file.filename),
      }),
    );

    await this.evidenceRepo.save(evidences);
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
}
