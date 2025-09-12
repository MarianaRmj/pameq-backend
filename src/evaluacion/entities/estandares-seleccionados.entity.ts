import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Proceso } from 'src/processes/entities/process.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Estandar } from './estandar.entity';

@Entity('estandares_seleccionados')
export class EstandarSeleccionado {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Relación con ciclo
  @ManyToOne(() => Ciclo, { eager: true })
  ciclo: Ciclo;

  // 🔗 Relación con proceso
  @ManyToOne(() => Proceso, { eager: true })
  proceso: Proceso;

  // 🔗 Relación con estándar (opcional si quieres bajar a ese nivel)
  @ManyToOne(() => Estandar, { eager: true, nullable: true })
  estandar?: Estandar;

  // Datos de selección
  @Column({ default: false })
  seleccionado: boolean;

  @Column({ nullable: true })
  observaciones: string;

  @Column()
  usuario_id: number;

  @CreateDateColumn()
  fecha_registro: Date;
}
