// src/fortalezas/entities/fortaleza.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity('fortalezas_estandar')
export class FortalezaEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EvaluacionCualitativaEstandar,
    (evaluacion) => evaluacion.fortalezas,
    { onDelete: 'CASCADE' },
  )
  evaluacion: EvaluacionCualitativaEstandar;

  @ManyToOne(() => Estandar, { onDelete: 'CASCADE' })
  estandar: Estandar;

  @Column('text')
  descripcion: string;

  @ManyToMany(() => Proceso, { eager: true })
  @JoinTable({
    name: 'fortalezas_procesos',
    joinColumn: { name: 'fortalezaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'procesoId', referencedColumnName: 'id' },
  })
  procesos: Proceso[];

  @CreateDateColumn()
  created_at: Date;
}
