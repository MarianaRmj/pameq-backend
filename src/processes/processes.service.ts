import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proceso } from './entities/process.entity';
import { CreateProcessDto } from './dto/create-process.dto';
import { UpdateProcessDto } from './dto/update-process.dto';
import { Institution } from 'src/institutions/entities/institution.entity';
import { IndicadorProceso } from './entities/indicador-proceso.entity';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,
    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,
    @InjectRepository(IndicadorProceso)
    private readonly indicadorRepo: Repository<IndicadorProceso>,
  ) {}

  async findAll(): Promise<Proceso[]> {
    return this.procesoRepo.find();
  }
  async create(data: CreateProcessDto) {
    const institution = await this.institutionRepo.findOne({
      where: { id: data.institutionId },
    });

    if (!institution) {
      throw new NotFoundException(
        `Institución con ID ${data.institutionId} no encontrada.`,
      );
    }

    const indicadores = data.indicadores.map((i) =>
      this.indicadorRepo.create({ nombre: i.nombre }),
    );

    const proceso = this.procesoRepo.create({
      nombre_proceso: data.nombre_proceso,
      descripcion: data.descripcion,
      lider: data.lider,
      numero_integrantes: Number(data.numero_integrantes),
      institution,
      indicadores, // se guarda en cascada
    });

    return this.procesoRepo.save(proceso);
  }

  async update(id: number, data: UpdateProcessDto) {
    const proceso = await this.procesoRepo.findOne({
      where: { id },
      relations: ['institution', 'indicadores'], // trae indicadores actuales
    });

    if (!proceso) {
      throw new NotFoundException(`Proceso con ID ${id} no encontrado.`);
    }

    // Cambiar institución si viene en el DTO
    if (data.institutionId) {
      const institution = await this.institutionRepo.findOne({
        where: { id: data.institutionId },
      });
      if (!institution) {
        throw new NotFoundException(
          `Institución con ID ${data.institutionId} no encontrada.`,
        );
      }
      proceso.institution = institution;
    }

    // Lógica de reemplazo con soft delete
    if (data.indicadores) {
      // 1. Eliminar lógicamente los actuales
      await this.indicadorRepo.softRemove(proceso.indicadores);

      // 2. Crear nuevos indicadores y asociarlos al proceso
      const nuevosIndicadores = data.indicadores.map((i) =>
        this.indicadorRepo.create({ nombre: i.nombre, proceso }),
      );

      proceso.indicadores = nuevosIndicadores;
    }

    // Actualizar el resto de campos
    Object.assign(proceso, data);

    return this.procesoRepo.save(proceso);
  }

  async remove(id: number) {
    const proceso = await this.procesoRepo.findOne({
      where: { id },
      relations: ['ciclos'],
    });
    if (!proceso) {
      throw new NotFoundException(`Proceso con ID ${id} no encontrado.`);
    }
    if (proceso.ciclos && proceso.ciclos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar el proceso porque tiene ciclos asociados.',
      );
    }
    await this.procesoRepo.remove(proceso);
    return { message: 'Proceso eliminado correctamente' };
  }
}
