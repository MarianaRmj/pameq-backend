import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ScheduleTask } from './entities/schedule-task.entity';
import { CreateScheduleTaskDto } from './dto/CreateScheduleTaskDto';
import { UpdateScheduleTaskDto } from './dto/UpdateScheduleTaskDto';

@Injectable()
export class ScheduleTaskService {
  constructor(
    @InjectRepository(ScheduleTask)
    private readonly scheduleTaskRepo: Repository<ScheduleTask>,
  ) {}

  async create(dto: CreateScheduleTaskDto): Promise<ScheduleTask> {
    const task = this.scheduleTaskRepo.create({
      ...dto,
      predecesoras: dto.predecesoras ? dto.predecesoras.join(',') : undefined,
    });
    return await this.scheduleTaskRepo.save(task); // Esto debe devolver un solo objeto
  }

  async findAll(filters: {
    cicloId?: number;
    sedeId?: number;
    institucionId?: number;
    responsableId?: number;
  }): Promise<ScheduleTask[]> {
    const where: FindOptionsWhere<ScheduleTask> = {};
    if (filters.cicloId) where.cicloId = filters.cicloId;
    if (filters.sedeId) where.sedeId = filters.sedeId;
    if (filters.institucionId) where.institucionId = filters.institucionId;
    if (filters.responsableId) where.responsableId = filters.responsableId;
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
    Object.assign(task, {
      ...dto,
      predecesoras: dto.predecesoras
        ? dto.predecesoras.join(',')
        : task.predecesoras,
    });
    return await this.scheduleTaskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleTaskRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Actividad no encontrada');
  }
}
