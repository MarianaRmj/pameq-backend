import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepo.create(dto);
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
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    await this.eventRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepo.delete(id);
  }
}
