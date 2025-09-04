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

@Entity('calificaciones_estandar')
export class CalificacionEstandar {
  @PrimaryGeneratedColumn() id: number;
  @Column() estandar_id: number;
  @Column() autoevaluacion_id: number;
  @Column() sistematicidad: number;
  @Column() proactividad: number;
  @Column() ciclo_evaluacion: number;
  @Column() total_enfoque: number;
  @Column() despliegue_institucion: number;
  @Column() despliegue_cliente: number;
  @Column() total_implementacion: number;
  @Column() pertinencia: number;
  @Column() consistencia: number;
  @Column() avance_medicion: number;
  @Column() tendencia: number;
  @Column() comparacion: number;
  @Column() total_resultados: number;
  @Column() total_estandar: number;
  @Column('float') // o int, dependiendo de tu lógica
  calificacion: number;
  @Column('text', { nullable: true }) observaciones?: string;
  @CreateDateColumn() created_at: Date;

  @ManyToOne(() => Estandar, { eager: true })
  @JoinColumn({ name: 'estandar_id' })
  estandar: Estandar;

  @ManyToOne(() => Autoevaluacion, { nullable: false })
  @JoinColumn({ name: 'autoevaluacion_id' })
  autoevaluacion: Autoevaluacion;
}
