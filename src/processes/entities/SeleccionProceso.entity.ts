import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';
import { Proceso } from './process.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Entity('seleccion_proceso')
export class SeleccionProceso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proceso, { eager: true })
  @JoinColumn({ name: 'proceso_id' })
  proceso: Proceso;

  @ManyToOne(() => Estandar, { nullable: true })
  @JoinColumn({ name: 'estandar_id' })
  estandar?: Estandar;

  @ManyToOne(() => Ciclo, { eager: true, nullable: false })
  @JoinColumn({ name: 'ciclo_id' })
  ciclo: Ciclo;

  @Column()
  usuario_id: number;

  @Column({ type: 'boolean', default: false })
  seleccionado: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  fecha_registro: Date;
}
