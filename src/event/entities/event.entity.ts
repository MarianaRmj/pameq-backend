import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Entity('eventos')
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
}
