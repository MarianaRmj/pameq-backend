import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Institution } from 'src/institutions/entities/institution.entity';

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_sede: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  nombre_lider: string;

  @Column()
  codigo_habilitacion: string;

  @ManyToOne(() => Institution, (institution) => institution.sedes)
  institution: Institution;
}
