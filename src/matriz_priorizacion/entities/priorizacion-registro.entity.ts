import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proceso } from 'src/processes/entities/process.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity({ name: 'priorizacion_registro' })
@Unique(['proceso', 'estandar'])
export class PriorizacionRegistro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proceso, { eager: true })
  @JoinColumn({ name: 'proceso_id' })
  @Index()
  proceso: Proceso;

  @ManyToOne(() => Estandar, { eager: true })
  @JoinColumn({ name: 'estandar_id' })
  @Index()
  estandar: Estandar;

  @Column({ type: 'smallint' })
  riesgo: number;

  @Column({ type: 'smallint' })
  costo: number;

  @Column({ type: 'smallint' })
  frecuencia: number;

  // Si usas Postgres 12+, puedes definir total como columna generada en la migration.
  @Column({ type: 'int' })
  total: number;

  @Column({ default: false })
  confirmado: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
