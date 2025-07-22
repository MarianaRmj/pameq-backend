import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sede } from './entities/sede.entity';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { Institution } from 'src/institutions/entities/institution.entity';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private sedeRepo: Repository<Sede>,

    @InjectRepository(Institution)
    private institutionRepo: Repository<Institution>,
  ) {}

  async create(dto: CreateSedeDto) {
    const institution = await this.institutionRepo.findOne({
      where: { id: dto.institutionId },
    });

    if (!institution) {
      throw new NotFoundException('Institución no encontrada');
    }

    const sede = this.sedeRepo.create({
      nombre: dto.nombre,
      ciudad: dto.ciudad,
      institution,
    });

    return this.sedeRepo.save(sede);
  }

  findAll() {
    return this.sedeRepo.find({ relations: ['institution'] });
  }

  findOne(id: number) {
    return this.sedeRepo.findOne({ where: { id }, relations: ['institution'] });
  }

  async update(id: number, dto: UpdateSedeDto) {
    const sede = await this.sedeRepo.findOneBy({ id });
    if (!sede) throw new NotFoundException('Sede no encontrada');

    if (dto.institutionId) {
      const institution = await this.institutionRepo.findOneBy({
        id: dto.institutionId,
      });
      if (!institution)
        throw new NotFoundException('Institución no encontrada');
      sede.institution = institution;
    }

    Object.assign(sede, dto);
    return this.sedeRepo.save(sede);
  }

  remove(id: number) {
    return this.sedeRepo.delete(id);
  }
}
