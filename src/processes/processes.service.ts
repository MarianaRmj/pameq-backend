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
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { SelectProcessDto } from './dto/select-process.dto';
import { EstandarSeleccionado } from 'src/evaluacion/entities/estandares-seleccionados.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesoRepo: Repository<Proceso>,

    @InjectRepository(Institution)
    private readonly institutionRepo: Repository<Institution>,

    @InjectRepository(IndicadorProceso)
    private readonly indicadorRepo: Repository<IndicadorProceso>,

    @InjectRepository(EvaluacionCualitativaEstandar)
    private readonly cualitativaRepo: Repository<EvaluacionCualitativaEstandar>,

    @InjectRepository(Estandar)
    private readonly estandarRepo: Repository<Estandar>,

    @InjectRepository(EstandarSeleccionado)
    private readonly seleccionRepo: Repository<EstandarSeleccionado>,

    @InjectRepository(OportunidadMejoraEstandar)
    private readonly oportunidadRepo: Repository<OportunidadMejoraEstandar>,
  ) {}

  // ============= CRUD de Procesos =============

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

  // ============= NUEVO MÉTODO: Recuento de Oportunidades =============
  async contarOportunidadesPorProceso(cicloId: number) {
    const raw = await this.oportunidadRepo
      .createQueryBuilder('op')
      .innerJoin('op.evaluacion', 'eval')
      .innerJoin('op.proceso', 'proceso')
      .where(
        'eval.autoevaluacion_id IN (SELECT id FROM autoevaluaciones WHERE ciclo = :cicloId)',
        { cicloId },
      )
      .select('proceso.id', 'id') // 👈 añadimos el id del proceso
      .addSelect('proceso.nombre_proceso', 'proceso')
      .addSelect('COUNT(op.id)', 'oportunidades')
      .groupBy('proceso.id')
      .addGroupBy('proceso.nombre_proceso')
      .orderBy('oportunidades', 'DESC')
      .getRawMany();

    console.log('🔎 Recuento generado:', raw);

    return (
      raw as Array<{ id: string; proceso: string; oportunidades: string }>
    ).map((r) => ({
      id: Number(r.id), // 👈 ya tienes el id como number
      proceso: r.proceso,
      oportunidades: Number(r.oportunidades),
    }));
  }

  async guardarSeleccion(dto: SelectProcessDto) {
    const seleccion = {
      ciclo: { id: dto.cicloId } as Ciclo,
      proceso: { id: dto.procesoId } as Proceso,
      estandar: dto.estandarId
        ? ({ id: dto.estandarId } as Estandar)
        : undefined,
      usuario_id: dto.usuarioId,
      seleccionado: dto.seleccion,
      observaciones: dto.observaciones,
    };

    return this.seleccionRepo.save(seleccion);
  }

  async listarSeleccionadosPorCiclo(cicloId: number) {
    return this.seleccionRepo
      .createQueryBuilder('sel')
      .leftJoinAndSelect('sel.proceso', 'proceso')
      .leftJoinAndSelect('sel.ciclo', 'ciclo')
      .leftJoinAndSelect('sel.estandar', 'estandar')
      .where('ciclo.id = :cicloId', { cicloId })
      .orderBy('sel.fecha_registro', 'DESC')
      .getMany();
  }
}
