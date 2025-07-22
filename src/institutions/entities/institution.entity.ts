import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sede } from 'src/sedes/entities/sede.entity';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  nit: string;

  @Column()
  tipo: string;

  @OneToMany(() => Sede, (sede) => sede.institution)
  sedes: Sede[];
}
