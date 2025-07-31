import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_sede: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  nombre_lider: string;

  @Column()
  codigo_habilitacion: string;

  @ManyToOne(() => Institution, (institution) => institution.sedes)
  institution: Institution;

  @OneToMany(() => Ciclo, (ciclo) => ciclo.sede)
  ciclos: Ciclo[];
}
