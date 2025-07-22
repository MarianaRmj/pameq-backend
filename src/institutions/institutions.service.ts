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

  async update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    const institution = await this.institutionRepo.findOne({ where: { id } });

    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }

    Object.assign(institution, updateInstitutionDto);
    return this.institutionRepo.save(institution);
  }

  async findOne(id: number) {
    const institution = await this.institutionRepo.findOne({ where: { id } });

    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }

    return institution;
  }
}
