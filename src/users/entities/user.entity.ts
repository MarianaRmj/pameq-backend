import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ select: false, nullable: true })
  password: string; // **AGREGA este campo para login seguro**

  @Column({ unique: true })
  email: string;

  @Column({ length: 50 })
  rol: string;

  @Column({ nullable: true })
  sede_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
