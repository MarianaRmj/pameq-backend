// src/cycles/entities/cycle.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { CicloEstado } from '../enums/ciclo-estado.enum';
import { Event } from 'src/event/entities/event.entity';

@Entity()
export class Ciclo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha_inicio: string;

  @Column({ type: 'date' })
  fecha_fin: string;

  @Column()
  enfoque: string;

  @Column({
    type: 'enum',
    enum: CicloEstado,
    default: CicloEstado.ACTIVO,
  })
  estado: CicloEstado;

  @Column({ nullable: true })
  observaciones: string;

  @ManyToOne(() => Sede, (sede) => sede.ciclos, { eager: true })
  @JoinColumn({ name: 'sede_id' })
  sede: Sede;

  @ManyToOne(() => Institution, (institution) => institution.ciclos, {
    eager: false,
    nullable: false,
  })
  institution: Institution;

  @OneToMany(() => Event, (event) => event.ciclo)
  events: Event[];
}
