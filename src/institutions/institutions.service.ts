import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
  ) {}

  async create(data: CreateInstitutionDto) {
    const newInstitution = this.institutionRepo.create(data);
    return this.institutionRepo.save(newInstitution);
  }

  async update(id: number, dto: UpdateInstitutionDto) {
    // Preload busca la entidad con ID y asigna las propiedades nuevas
    const institution = await this.institutionRepo.preload({
      id,
      ...dto,
    });

    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }

    delete (institution as Partial<Institution>).ciclos;

    return this.institutionRepo.save(institution);
  }

  async findOne(id: number) {
    const institution = await this.institutionRepo.findOne({
      where: { id },
      relations: ['ciclos', 'ciclos.sede'], // ✅ Incluye ciclos y la sede si es necesario
    });

    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }

    return institution;
  }

  async findCiclosByInstitution(id: number) {
    const institution = await this.institutionRepo.findOne({
      where: { id },
      relations: ['ciclos', 'ciclos.sede'], // incluir sede si deseas mostrar nombre
    });
    return institution?.ciclos ?? [];
  }
}
