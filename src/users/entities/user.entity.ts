import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sede } from 'src/sedes/entities/sede.entity';

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 50 })
  rol: string;

  @ManyToOne(() => Sede, { nullable: true })
  @JoinColumn({ name: 'sede_id' }) // Nombre explícito de la columna FK
  sede?: Sede;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;
}
