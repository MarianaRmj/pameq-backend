import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('evaluacion_cualitativa_estandar')
export class EvaluacionCualitativaEstandar {
  @PrimaryGeneratedColumn() id: number;
  @Column() estandar_id: number;
  @Column() autoevaluacion_id: number;
  @Column('text', { nullable: true }) fortalezas?: string;
  @Column('text', { nullable: true }) soportes_fortalezas?: string;
  @Column('text', { nullable: true }) oportunidades_mejora?: string;
  @Column('text', { nullable: true }) efecto_oportunidades?: string;
  @Column('text', { nullable: true }) acciones_mejora?: string;
  @Column('text', { nullable: true }) limitantes_acciones?: string;
  @CreateDateColumn() created_at: Date;
}
