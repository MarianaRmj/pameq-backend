// src/autoevaluacion/entities/autoevaluacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';

@Entity('autoevaluaciones')
export class Autoevaluacion {
  @PrimaryGeneratedColumn() id: number;
  @Column() sede_id: number;
  @Column() usuario_id: number;
  @Column() ciclo: string;

  @CreateDateColumn({ name: 'fecha_evaluacion' }) fechaEvaluacion: Date;
  @ManyToMany(() => Estandar, (e) => e.autoevaluaciones)
  @JoinTable()
  estandares: Estandar[];

  @OneToMany(
    () => EvaluacionCualitativaEstandar,
    (evaluacion) => evaluacion.autoevaluacion,
  )
  evaluaciones: EvaluacionCualitativaEstandar[];
}
