import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Entity('eventos')
@Index(['refType', 'refId'], {
  unique: true,
  where: '"refType" IS NOT NULL AND "refId" IS NOT NULL',
})
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  inicio: Date;

  @Column()
  fin: Date;

  @Column({ default: 'actividad' })
  tipo: string;

  // Quién creó el evento
  @ManyToOne(() => User, (user) => user.events, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // Opcional: relación con Ciclo
  @ManyToOne(() => Ciclo, (ciclo) => ciclo.events, { nullable: true })
  @JoinColumn({ name: 'cicloId' })
  ciclo?: Ciclo;

  @Column({ nullable: true })
  cicloId?: number;

  @Column({ nullable: true }) refType?: 'activity'; // null en manuales
  @Column({ nullable: true }) refId?: number; // null en manuales
}
