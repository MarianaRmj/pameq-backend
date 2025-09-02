import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estandares_acreditacion')
export class Estandar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  grupo: string;

  @Column()
  codigo: string;

  @Column()
  descripcion: string;

  @Column('simple-array')
  criterios: string[];
}
