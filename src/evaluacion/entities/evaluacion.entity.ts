import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OportunidadMejoraEstandar } from 'src/oportunidad-mejora/entities/oportunidad-mejora.entity';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import { FortalezaEstandar } from 'src/fortalezas/entities/fortaleza.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

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
  fortalezas_json: string[];

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

  @OneToMany(() => OportunidadMejoraEstandar, (o) => o.evaluacion, {
    cascade: true,
  })
  oportunidades: OportunidadMejoraEstandar[];

  @OneToMany(() => FortalezaEstandar, (f) => f.evaluacion, { cascade: true })
  fortalezas: FortalezaEstandar[];

  // 🔹 relaciones explícitas para poder hacer joins por nombre
  @ManyToOne(() => Autoevaluacion, (a) => a.evaluaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'autoevaluacion_id' })
  autoevaluacion: Autoevaluacion;

  @ManyToOne(() => Estandar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estandar_id' })
  estandar: Estandar;
}
