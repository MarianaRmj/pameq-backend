import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity('priorizacion_estandares')
export class PriorizacionEstandar {
  @PrimaryGeneratedColumn() id: number;
  @Column() autoevaluacion_id: number;
  @Column() estandar_id: number;
  @Column() cumplimiento: number;
  @Column() impacto: number;
  @Column() viabilidad: number;
  @Column() puntaje_total: number;
  @CreateDateColumn() created_at: Date;

  @ManyToOne(() => Estandar, { eager: true })
  @JoinColumn({ name: 'estandar_id' })
  estandar: Estandar;
}
