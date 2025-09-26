import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

export type DominioPrior = 'riesgo' | 'costo' | 'frecuencia';

@Entity({ name: 'priorizacion_criterio' })
@Unique(['dominio', 'valor'])
export class PriorizacionCriterio {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  dominio: DominioPrior;

  @Column({ type: 'smallint' })
  valor: number; // 1 | 3 | 5

  @Column({ type: 'text' })
  etiqueta: string;
}
