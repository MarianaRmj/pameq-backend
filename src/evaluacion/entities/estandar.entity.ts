import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';

@Entity('estandares_acreditacion')
export class Estandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grupo: string;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column('text', { array: true })
  criterios: string[];

  @ManyToMany(() => Autoevaluacion, (a) => a.estandares)
  autoevaluaciones: Autoevaluacion[];

  @ManyToOne(() => Proceso, (proceso) => proceso.estandares, { nullable: true })
  @JoinColumn({ name: 'proceso_id' }) // ← agrega el JoinColumn si falta
  proceso: Proceso;
}
