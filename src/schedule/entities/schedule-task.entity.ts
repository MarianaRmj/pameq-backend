import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Sede } from '../../sedes/entities/sede.entity';
import { Institution } from '../../institutions/entities/institution.entity';

@Entity('cronograma')
export class ScheduleTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_tarea: string;

  @Column({ type: 'date' })
  fecha_comienzo: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'int', nullable: true })
  duracion?: number;

  @Column({ nullable: true })
  estado?: 'pendiente' | 'en_curso' | 'finalizado';

  @Column({ nullable: true })
  responsable: string;

  @Column({ nullable: true })
  progreso?: number;

  @Column({ nullable: true })
  observaciones?: string;

  @Column({ type: 'simple-array', nullable: true })
  predecesoras?: string;

  // Relaciones
  @ManyToOne(() => Ciclo, { nullable: false })
  @JoinColumn({ name: 'cicloId' })
  ciclo: Ciclo;

  @Column()
  cicloId: number;

  @ManyToOne(() => Sede, { nullable: true })
  @JoinColumn({ name: 'sedeId' })
  sede?: Sede;

  @Column({ nullable: true })
  sedeId?: number;

  @ManyToOne(() => Institution, { nullable: true })
  @JoinColumn({ name: 'institucionId' })
  institucion?: Institution;

  @Column({ nullable: true })
  institucionId?: number;
}
