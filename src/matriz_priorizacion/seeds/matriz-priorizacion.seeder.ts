// src/matriz_priorizacion/seeds/matriz-priorizacion.seeder.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriorizacionCriterio } from '../entities/priorizacion-criterio.entity';
import criteriosJson from './criterios.priorizacion.json';

// Tipos literales que espera tu entity
type DominioPrior = 'riesgo' | 'costo' | 'frecuencia';
type ValorPrior = 1 | 3 | 5;

type CriterioSeed = {
  dominio: DominioPrior;
  valor: ValorPrior;
  etiqueta: string;
};

function isDominio(x: any): x is DominioPrior {
  return x === 'riesgo' || x === 'costo' || x === 'frecuencia';
}
function isValor(x: any): x is ValorPrior {
  return x === 1 || x === 3 || x === 5;
}

@Injectable()
export class MatrizPriorizacionSeeder implements OnModuleInit {
  private readonly logger = new Logger(MatrizPriorizacionSeeder.name);

  constructor(
    @InjectRepository(PriorizacionCriterio)
    private readonly criteriosRepo: Repository<PriorizacionCriterio>,
  ) {}

  async onModuleInit() {
    try {
      // 1) Valida y estrecha tipos del JSON a los literales que pide la entity
      const payload: CriterioSeed[] = (criteriosJson as any[]).map(
        (c: unknown, idx: number) => {
          const item = c as Record<string, unknown>;
          if (!isDominio(item.dominio)) {
            throw new Error(
              `criterios.priorizacion.json[${idx}].dominio inválido: ${String(item.dominio)}`,
            );
          }
          if (!isValor(item.valor)) {
            throw new Error(
              `criterios.priorizacion.json[${idx}].valor inválido: ${String(item.valor)}`,
            );
          }
          return {
            dominio: item.dominio, // ahora es 'riesgo' | 'costo' | 'frecuencia'
            valor: item.valor, // ahora es 1 | 3 | 5
            etiqueta: typeof item.etiqueta === 'string' ? item.etiqueta : '',
          };
        },
      );

      // 2) Upsert idempotente por (dominio, valor)
      await this.criteriosRepo.upsert(
        payload.map((c) => this.criteriosRepo.create(c)),
        ['dominio', 'valor'],
      );

      const count = await this.criteriosRepo.count();
      this.logger.log(
        `✔ Criterios de priorización cargados/actualizados. Registros: ${count}`,
      );
    } catch (err) {
      this.logger.error('❌ Error sembrando criterios de priorización', err);
    }
  }
}
