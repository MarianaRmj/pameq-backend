import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Sede } from '../../sedes/entities/sede.entity';
import { Institution } from '../../institutions/entities/institution.entity';

export type EstadoTarea = 'pendiente' | 'en proceso' | 'finalizado';

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

  @Column({
    type: 'enum',
    enum: ['pendiente', 'en_curso', 'finalizado'],
    default: 'pendiente',
    nullable: true,
  })
  estado?: EstadoTarea;

  @Column({ nullable: true })
  responsable: string;

  @Column({ type: 'int', default: 0, nullable: true })
  progreso?: number;

  @Column({ nullable: true })
  observaciones?: string;

  // ⬇️ Cambiamos a texto plano; el front envía string (ej: "1,3FS,7")
  @Column({ type: 'text', nullable: true })
  predecesoras?: string | null;

  @Column({
    type: 'enum',
    enum: ['baja', 'media', 'alta'],
    default: 'media',
    nullable: true,
  })
  prioridad?: 'baja' | 'media' | 'alta';

  // ---- Jerarquía ----
  @ManyToOne(() => ScheduleTask, (t) => t.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: ScheduleTask | null;

  @Column({ type: 'int', nullable: true })
  parentId?: number | null;

  @OneToMany(() => ScheduleTask, (t) => t.parent)
  children?: ScheduleTask[];

  // Relaciones existentes
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
