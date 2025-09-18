// src/oportunidades/entities/oportunidad-mejora.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { EvaluacionCualitativaEstandar } from 'src/evaluacion/entities/evaluacion.entity';
import { Proceso } from 'src/processes/entities/process.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity('oportunidades_mejora_estandar')
export class OportunidadMejoraEstandar {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EvaluacionCualitativaEstandar,
    (evaluacion) => evaluacion.oportunidades,
    { onDelete: 'CASCADE' },
  )
  evaluacion: EvaluacionCualitativaEstandar;

  @ManyToOne(() => Estandar, { onDelete: 'CASCADE' })
  estandar: Estandar;

  @Column('text')
  descripcion: string;

  @ManyToMany(() => Proceso, { eager: true })
  @JoinTable({
    name: 'oportunidades_procesos',
    joinColumn: { name: 'oportunidadId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'procesoId', referencedColumnName: 'id' },
  })
  procesos: Proceso[];

  @CreateDateColumn()
  created_at: Date;
}
