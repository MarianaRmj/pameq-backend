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

  @Column('text')
  descripcion: string;

  @ManyToMany(() => Proceso, { eager: true })
  @JoinTable({
    name: 'oportunidades_procesos', // tabla intermedia
    joinColumn: { name: 'oportunidadId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'procesoId', referencedColumnName: 'id' },
  })
  procesos: Proceso[];

  @CreateDateColumn()
  created_at: Date;
}
