import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PriorizacionEstandar } from 'src/priorizacion/entities/priorizacion.entity';

@Entity('calidad_esperada_estandar')
export class CalidadEsperadaEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  calidad_esperada: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => PriorizacionEstandar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'priorizacion_id' })
  priorizacion: PriorizacionEstandar;

  @Column()
  priorizacion_id: number;
}
