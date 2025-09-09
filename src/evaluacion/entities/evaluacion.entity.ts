// entities/evaluacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Index(['estandarId', 'autoevaluacionId'], { unique: true })
@Entity('evaluacion_cualitativa')
export class EvaluacionCualitativaEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'estandar_id' })
  estandarId: number;

  @Column({ name: 'autoevaluacion_id' })
  autoevaluacionId: number;

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  fortalezas: string[];

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  oportunidades_mejora: string[];
  @Column('text', { nullable: true })
  soportes_fortalezas: string | null;

  @Column('text', { nullable: true })
  efecto_oportunidades: string | null;

  @Column('text', { nullable: true })
  acciones_mejora: string | null;

  @Column('text', { nullable: true })
  limitantes_acciones: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
