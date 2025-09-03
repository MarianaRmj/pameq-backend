import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';

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
}
