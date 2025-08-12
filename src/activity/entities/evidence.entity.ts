import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Relation,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('evidencia')
export class Evidence {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    (): typeof Activity => Activity,
    (a: Activity): Relation<Evidence[]> => a.evidencias,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'activityId' })
  activity!: Relation<Activity>;

  @Column()
  activityId!: number;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column('bigint')
  size!: number;

  @Column()
  url!: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploaded_at!: Date;
}
