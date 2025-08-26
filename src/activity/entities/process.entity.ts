import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('procesos_invitados')
export class Process {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  nombre!: string;

  @Column({ default: true })
  activo!: boolean;
}
