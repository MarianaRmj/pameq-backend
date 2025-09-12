// entities/evaluacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';

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

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  efecto_oportunidades: string[];

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  acciones_mejora: string[];

  @Column({ type: 'jsonb', nullable: false, default: () => "'[]'::jsonb" })
  limitantes_acciones: string[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(
    () => OportunidadMejoraEstandar,
    (oportunidad) => oportunidad.evaluacion,
    { cascade: true },
  )
  oportunidades: OportunidadMejoraEstandar[];

  @ManyToOne(() => Autoevaluacion, (autoeval) => autoeval.evaluaciones, {
    onDelete: 'CASCADE',
  })
  autoevaluacion: Autoevaluacion;
}
