import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IndicadorProceso } from './indicador-proceso.entity';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity('Procesos')
export class Proceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_proceso: string;

  @Column()
  descripcion: string;

  @Column()
  lider: string;

  @Column()
  numero_integrantes: number;

  @OneToMany(() => IndicadorProceso, (indicador) => indicador.proceso, {
    cascade: true,
    eager: true, // opcional: si quieres que se traigan automáticamente al hacer find()
  })
  indicadores: IndicadorProceso[];

  @ManyToOne(() => Institution, (institution) => institution.sedes)
  institution: Institution;

  @OneToMany(() => Ciclo, (ciclo) => ciclo.sede)
  ciclos: Ciclo[];

  @OneToMany(() => Estandar, (estandar) => estandar.proceso)
  estandares: Estandar[];

  @Column({ default: true })
  activo: boolean;
}
