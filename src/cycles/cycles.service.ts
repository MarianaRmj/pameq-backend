import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciclo } from './entities/cycle.entity';
import { CreateCicloDto } from './dto/create-cycle.dto';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { UpdateCicloDto } from './dto/update-cycle.dto';

@Injectable()
export class CyclesService {
  constructor(
    @InjectRepository(Ciclo)
    private readonly cicloRepo: Repository<Ciclo>,

    @InjectRepository(Sede)
    private readonly sedeRepo: Repository<Sede>,

    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
  ) {}

  async create(createCicloDto: CreateCicloDto) {
    const existe = await this.cicloRepo.findOne({
      where: {
        sede: { id: createCicloDto.sedeId },
        fecha_inicio: createCicloDto.fecha_inicio,
        fecha_fin: createCicloDto.fecha_fin,
        enfoque: createCicloDto.enfoque,
        institution: { id: createCicloDto.institutionId },
      },
      relations: ['sede', 'institution'],
    });

    if (existe) {
      throw new BadRequestException('Ya existe un ciclo con esta información');
    }

    const sede = await this.sedeRepo.findOne({
      where: { id: createCicloDto.sedeId },
    });
    if (!sede) throw new NotFoundException('Sede no encontrada');

    const institution = await this.institutionRepo.findOne({
      where: { id: createCicloDto.institutionId },
    });
    if (!institution) throw new NotFoundException('Institución no encontrada');

    const ciclo = this.cicloRepo.create({
      ...createCicloDto,
      sede,
      institution,
    });

    return this.cicloRepo.save(ciclo);
  }

  findAll(): Promise<Ciclo[]> {
    return this.cicloRepo.find({
      relations: ['sede', 'institution'],
      order: { fecha_inicio: 'DESC' },
    });
  }

  findOne(id: number): Promise<Ciclo | null> {
    return this.cicloRepo.findOne({
      where: { id },
      relations: ['sede', 'institution'],
    });
  }

  async update(id: number, dto: UpdateCicloDto): Promise<Ciclo> {
    console.log('🧪 DTO recibido en update:', dto);
    const ciclo = await this.cicloRepo.findOne({
      where: { id },
      relations: ['sede', 'institution'],
    });

    if (!ciclo) {
      throw new NotFoundException(`Ciclo con ID ${id} no encontrado`);
    }

    if (dto.sedeId) {
      const sede = await this.sedeRepo.findOne({ where: { id: dto.sedeId } });
      if (!sede) throw new NotFoundException('Sede no encontrada');
      ciclo.sede = sede;
    }

    Object.assign(ciclo, dto);

    return this.cicloRepo.save(ciclo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cicloRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ciclo no encontrado');
    }
  }
}
