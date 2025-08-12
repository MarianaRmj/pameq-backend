import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { User } from 'src/users/entities/user.entity';
import { Evidence } from './evidence.entity';
import { Process } from './process.entity';

export type EstadoActividad =
  | 'programada'
  | 'en_proceso'
  | 'finalizada'
  | 'cancelada';

@Entity('actividad')
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nombre_actividad' })
  nombre_actividad!: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'fecha_inicio', type: 'timestamp' })
  fecha_inicio!: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp' })
  fecha_fin!: Date;

  @Column({ name: 'lugar', nullable: true })
  lugar?: string;

  @Column({
    name: 'estado',
    type: 'enum',
    enum: ['programada', 'en_proceso', 'finalizada', 'cancelada'],
    default: 'programada',
  })
  estado!: EstadoActividad;

  // Contexto
  @ManyToOne((): typeof Institution => Institution, { eager: true })
  @JoinColumn({ name: 'institutionId' })
  institution!: Relation<Institution>;

  @Column()
  institutionId!: number;

  @ManyToOne((): typeof Sede => Sede, { eager: true, nullable: true })
  @JoinColumn({ name: 'sedeId' })
  sede?: Relation<Sede>;

  @Column({ nullable: true })
  sedeId?: number;

  @ManyToOne((): typeof Ciclo => Ciclo, { eager: true, nullable: true })
  @JoinColumn({ name: 'cicloId' })
  ciclo?: Relation<Ciclo>;

  @Column({ nullable: true })
  cicloId?: number;

  // Responsable
  @ManyToOne((): typeof User => User, { eager: true })
  @JoinColumn({ name: 'responsableId' })
  responsable!: Relation<User>;

  @Column()
  responsableId!: number;

  // Procesos invitados
  @ManyToMany((): typeof Process => Process, { eager: true })
  @JoinTable({ name: 'actividad_proceso' })
  procesos_invitados!: Relation<Process>[];

  // Evidencias
  @OneToMany(
    (): typeof Evidence => Evidence,
    (e: Evidence): Activity => e.activity,
    { cascade: true },
  )
  evidencias!: Relation<Evidence>[];

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
