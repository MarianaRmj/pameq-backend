import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
    {
      onDelete: 'CASCADE',
    },
  )
  evaluacion: EvaluacionCualitativaEstandar;

  @ManyToOne(() => Proceso, { eager: true, nullable: true })
  proceso: Proceso;

  @Column('text')
  descripcion: string;

  @CreateDateColumn()
  created_at: Date;
}
