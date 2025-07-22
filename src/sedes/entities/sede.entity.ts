import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @ManyToOne(() => Institution, (institution) => institution.sedes)
  institution: Institution;
}
