import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Event } from 'src/event/entities/event.entity';
import { Institution } from 'src/institutions/entities/institution.entity';

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50 })
  rol: string;

  // === Sede obligatoria ===
  @ManyToOne(() => Sede, { nullable: false })
  @JoinColumn({ name: 'sedeId' })
  sede: Sede;

  @Column({ type: 'int' })
  sedeId: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  // === Institution obligatoria (se obtiene del header x-institution-id) ===
  @ManyToOne(() => Institution, (institution) => institution, { eager: false })
  @JoinColumn({ name: 'institutionId' })
  institution: Institution;

  @Column({ type: 'int' })
  institutionId: number;

  @Column({ default: true })
  activo: boolean;
}
