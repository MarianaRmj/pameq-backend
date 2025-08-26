// src/pamec/pamec.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtapaRutaCritica } from './entities/etapa.entity';
import { AvanceEtapa } from './entities/avance-etapa.entity';
import { FormularioEtapa } from './entities/formulario.entity';
import { CampoFormulario } from './entities/campo.entity';
import {
  CreateRespuestaFormularioDto,
  UpdateRespuestaFormularioDto,
} from './dto/create-respuesta.dto';
import {
  AnexoFormulario,
  RespuestaFormulario,
  ValorRespuesta,
} from './entities/respuesta.entity';

@Injectable()
export class PamecService {
  constructor(
    @InjectRepository(EtapaRutaCritica)
    private etapaRepo: Repository<EtapaRutaCritica>,
    @InjectRepository(AvanceEtapa) private avanceRepo: Repository<AvanceEtapa>,
    @InjectRepository(FormularioEtapa)
    private formRepo: Repository<FormularioEtapa>,
    @InjectRepository(CampoFormulario)
    private campoRepo: Repository<CampoFormulario>,
    @InjectRepository(AnexoFormulario)
    private anexoRepo: Repository<AnexoFormulario>,
    @InjectRepository(ValorRespuesta)
    private valorRepo: Repository<ValorRespuesta>,
    @InjectRepository(RespuestaFormulario)
    private respuestaRepo: Repository<RespuestaFormulario>,
  ) {}

  async getEtapasByCiclo(cicloId: number, withProgress = false) {
    // 1) traer catálogo de etapas ordenado
    const etapas = await this.etapaRepo.find({ order: { orden: 'ASC' } });

    if (!etapas.length) return [];

    if (!withProgress) return etapas;

    // 2) traer avances del ciclo y mapear al más reciente por etapa
    const avances = await this.avanceRepo.find({ where: { cicloId } });
    const byEtapa = new Map<number, AvanceEtapa[]>();
    avances.forEach((a) => {
      const arr = byEtapa.get(a.etapaId) ?? [];
      arr.push(a);
      byEtapa.set(a.etapaId, arr);
    });

    return etapas.map((e) => {
      const arr = byEtapa.get(e.id) ?? [];
      // heurística: priorizar con fecha_fin, si no fecha_inicio
      const latest = arr.sort((a, b) => {
        const fa = a.fecha_fin ?? a.fecha_inicio ?? '';
        const fb = b.fecha_fin ?? b.fecha_inicio ?? '';
        return fa < fb ? 1 : fa > fb ? -1 : 0;
      })[0];

      return {
        ...e,
        progreso: latest
          ? {
              estado: latest.estado ?? null,
              fecha_inicio: latest.fecha_inicio ?? null,
              fecha_fin: latest.fecha_fin ?? null,
              responsableId: latest.responsableId ?? null,
              evidenciaUrl: latest.evidenciaUrl ?? null,
            }
          : null,
      };
    });
  }

  async getFormulariosByEtapa(etapaId: number, includeFields = false) {
    // validar que exista etapa
    const etapa = await this.etapaRepo.findOne({ where: { id: etapaId } });
    if (!etapa) throw new NotFoundException('La etapa no existe');

    if (!includeFields) {
      return this.formRepo.find({
        where: { etapaId, activo: true },
        order: { id: 'ASC' },
      });
    }

    // con campos embebidos
    const formularios = await this.formRepo.find({
      where: { etapaId, activo: true },
      relations: ['campos'],
      order: { id: 'ASC' },
    });

    // ordenar campos por 'orden'
    return formularios.map((f) => ({
      ...f,
      campos: (f.campos ?? []).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    }));
  }

  async crearRespuesta(
    formularioId: number,
    dto: CreateRespuestaFormularioDto,
  ) {
    const formulario = await this.formRepo.findOne({
      where: { id: formularioId, activo: true },
    });
    if (!formulario)
      throw new NotFoundException('Formulario no encontrado o inactivo');

    // Validar campos
    const campos = await this.campoRepo.find({ where: { formularioId } });
    const camposValidos = new Set(campos.map((c) => c.id));
    for (const v of dto.valores) {
      if (!camposValidos.has(v.campoId)) {
        throw new BadRequestException(`Campo inválido: ${v.campoId}`);
      }
    }

    const respuesta = this.respuestaRepo.create({
      formularioId,
      cicloId: dto.cicloId,
      sedeId: dto.sedeId,
      usuarioId: dto.usuarioId,
      estado: dto.estado,
    });
    await this.respuestaRepo.save(respuesta);

    const valores = dto.valores.map((v) =>
      this.valorRepo.create({
        respuestaId: respuesta.id,
        campoId: v.campoId,
        valor: v.valor,
      }),
    );
    await this.valorRepo.save(valores);

    if (dto.anexos?.length) {
      const anexos = dto.anexos.map((a) =>
        this.anexoRepo.create({
          respuestaId: respuesta.id,
          ...a,
        }),
      );
      await this.anexoRepo.save(anexos);
    }

    return { id: respuesta.id, fecha: respuesta.fechaRespuesta };
  }

  async getRespuestaCompleta(respuestaId: number) {
    const respuesta = await this.respuestaRepo.findOne({
      where: { id: respuestaId },
    });
    if (!respuesta) throw new NotFoundException('Respuesta no encontrada');

    const valores = await this.valorRepo.find({ where: { respuestaId } });
    const anexos = await this.anexoRepo.find({ where: { respuestaId } });

    return {
      ...respuesta,
      valores,
      anexos,
    };
  }

  async actualizarRespuesta(
    respuestaId: number,
    dto: UpdateRespuestaFormularioDto,
  ) {
    const respuesta = await this.respuestaRepo.findOne({
      where: { id: respuestaId },
    });
    if (!respuesta) throw new NotFoundException('Respuesta no encontrada');

    // 1. Actualizar estado
    if (dto.estado) {
      respuesta.estado = dto.estado;
      await this.respuestaRepo.save(respuesta);
    }

    // 2. Upsert de valores
    if (dto.valores?.length) {
      for (const v of dto.valores) {
        const existente = await this.valorRepo.findOne({
          where: { respuestaId, campoId: v.campoId },
        });

        if (existente) {
          existente.valor = v.valor;
          await this.valorRepo.save(existente);
        } else {
          await this.valorRepo.save({
            respuestaId,
            campoId: v.campoId,
            valor: v.valor,
          });
        }
      }
    }

    // 3. Agregar nuevos anexos
    if (dto.anexosAgregar?.length) {
      const anexos = dto.anexosAgregar.map((a) =>
        this.anexoRepo.create({ respuestaId, ...a }),
      );
      await this.anexoRepo.save(anexos);
    }

    // 4. Eliminar anexos por ID
    if (dto.anexosEliminarIds?.length) {
      await this.anexoRepo.delete(dto.anexosEliminarIds);
    }

    return { success: true };
  }

  async listarRespuestasPorCiclo(cicloId: number) {
    return this.respuestaRepo.find({
      where: { cicloId },
      order: { id: 'DESC' },
    });
  }
}
