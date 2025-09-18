import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estandar } from './estandar.entity';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';

@Entity('evaluacion_cuantitativa')
export class CalificacionEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'estandar_id' })
  estandarId: number;

  @Column({ name: 'autoevaluacion_id' })
  autoevaluacionId: number;

  @Column({ type: 'int', default: 0 })
  sistematicidad: number;

  @Column({ type: 'int', default: 0 })
  proactividad: number;

  @Column({ type: 'int', default: 0 })
  ciclo_evaluacion: number;

  @Column({ type: 'int', default: 0 })
  total_enfoque: number;

  @Column({ type: 'int', default: 0 })
  despliegue_institucion: number;

  @Column({ type: 'int', default: 0 })
  despliegue_cliente: number;

  @Column({ type: 'int', default: 0 })
  total_implementacion: number;

  @Column({ type: 'int', default: 0 })
  pertinencia: number;

  @Column({ type: 'int', default: 0 })
  consistencia: number;

  @Column({ type: 'int', default: 0 })
  avance_medicion: number;

  @Column({ type: 'int', default: 0 })
  tendencia: number;

  @Column({ type: 'int', default: 0 })
  comparacion: number;

  @Column({ type: 'int', default: 0 })
  total_resultados: number;

  @Column({ type: 'int', default: 0 })
  total_estandar: number;

  @Column('float', { default: 0 })
  calificacion: number;

  @Column({ default: false })
  confirmado: boolean;

  @Column('text', { nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Estandar, { eager: true })
  @JoinColumn({ name: 'estandar_id' })
  estandar: Estandar;

  @ManyToOne(() => Autoevaluacion, { nullable: false })
  @JoinColumn({ name: 'autoevaluacion_id' })
  autoevaluacion: Autoevaluacion;
}
