import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Proceso } from './process.entity';

@Entity('indicadores_proceso')
export class IndicadorProceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Proceso, (proceso) => proceso.indicadores, {
    onDelete: 'CASCADE',
  })
  proceso: Proceso;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Marca lógica de borrado
}
