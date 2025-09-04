// entities/evidencia-fortaleza.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Autoevaluacion } from 'src/autoevaluacion/entities/autoevaluacion.entity';
import { Estandar } from 'src/evaluacion/entities/estandar.entity';

@Entity('evidencias_fortalezas_estandar')
export class EvidenciaFortaleza {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Autoevaluacion)
  @JoinColumn({ name: 'autoevaluacion_id' })
  autoevaluacion: Autoevaluacion;

  @ManyToOne(() => Estandar)
  @JoinColumn({ name: 'estandar_id' })
  estandar: Estandar;

  @Column()
  nombre_archivo: string;

  @Column()
  tipo_archivo: string;

  @Column()
  url_archivo: string;

  @CreateDateColumn()
  fecha_carga: Date;
}
