import { Injectable } from '@nestjs/common';
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

  create(data: CreateInstitutionDto) {
    const newInstitution = this.institutionRepo.create(data);
    return this.institutionRepo.save(newInstitution);
  }

  findAll() {
    return this.institutionRepo.find({ relations: ['sedes'] });
  }

  findOne(id: number) {
    return this.institutionRepo.findOne({
      where: { id },
      relations: ['sedes'],
    });
  }

  update(id: number, changes: UpdateInstitutionDto) {
    return this.institutionRepo.update(id, changes);
  }

  remove(id: number) {
    return this.institutionRepo.delete(id);
  }
}
