// src/autoevaluacion/entities/autoevaluacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('autoevaluaciones')
export class Autoevaluacion {
  @PrimaryGeneratedColumn() id: number;
  @Column() sede_id: number;
  @Column() usuario_id: number;
  @Column() ciclo: string;
  @CreateDateColumn({ name: 'fecha_evaluacion' }) fechaEvaluacion: Date;
}
