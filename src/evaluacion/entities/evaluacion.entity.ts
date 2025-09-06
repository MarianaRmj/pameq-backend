// entities/evaluacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('evaluacion_cualitativa')
export class EvaluacionCualitativaEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'estandar_id' })
  estandarId: number;

  @Column({ name: 'autoevaluacion_id' })
  autoevaluacionId: number;

  // ✅ Default a [] para evitar null
  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  fortalezas: string[];

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  oportunidades_mejora: string[];

  @Column('text', { nullable: true })
  soportes_fortalezas?: string;

  @Column('text', { nullable: true })
  efecto_oportunidades?: string;

  @Column('text', { nullable: true })
  acciones_mejora?: string;

  @Column('text', { nullable: true })
  limitantes_acciones?: string;

  @CreateDateColumn()
  created_at: Date;
}
