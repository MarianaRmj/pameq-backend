import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private readonly sedeRepo: Repository<Sede>,
    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
  ) {}

  async findAll(): Promise<Sede[]> {
    return this.sedeRepo.find();
  }
  async create(data: CreateSedeDto) {
    const institution = await this.institutionRepo.findOne({
      where: { id: data.institutionId },
    });

    if (!institution) {
      throw new NotFoundException(
        `Institución con ID ${data.institutionId} no encontrada.`,
      );
    }

    const sede = this.sedeRepo.create({ ...data, institution });
    return this.sedeRepo.save(sede);
  }

  async update(id: number, data: UpdateSedeDto) {
    const sede = await this.sedeRepo.findOne({
      where: { id },
      relations: ['institution'],
    });

    if (!sede) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada.`);
    }

    if (data.institutionId) {
      const institution = await this.institutionRepo.findOne({
        where: { id: data.institutionId },
      });
      if (!institution) {
        throw new NotFoundException(
          `Institución con ID ${data.institutionId} no encontrada.`,
        );
      }
      sede.institution = institution;
    }

    Object.assign(sede, data);
    return this.sedeRepo.save(sede);
  }

  async remove(id: number) {
    const sede = await this.sedeRepo.findOne({
      where: { id },
      relations: ['ciclos'],
    });
    if (!sede) {
      throw new NotFoundException(`Sede con ID ${id} no encontrada.`);
    }
    if (sede.ciclos && sede.ciclos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar la sede porque tiene ciclos asociados.',
      );
    }
    await this.sedeRepo.remove(sede);
    return { message: 'Sede eliminada correctamente' };
  }
}
