// src/evaluacion/entities/detalle-priorizacion.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PriorizacionEstandar } from 'src/priorizacion/entities/priorizacion.entity';

@Entity('detalle_priorizacion_estandar')
export class DetallePriorizacionEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PriorizacionEstandar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'priorizacion_id' })
  priorizacion: PriorizacionEstandar;

  @Column()
  priorizacion_id: number;

  @Column({ type: 'text', nullable: true })
  fortalezas: string;

  @Column({ type: 'text', nullable: true })
  oportunidades_mejora: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;
}
