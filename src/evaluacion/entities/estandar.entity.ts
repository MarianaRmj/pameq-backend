import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estandares_acreditacion')
export class Estandar {
  @PrimaryGeneratedColumn() id: number;
  @Column() codigo: string;
  @Column() nombre: string;
}
