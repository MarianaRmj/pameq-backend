import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('hoja_radar')
export class HojaRadar {
  @PrimaryGeneratedColumn() id: number;
  @Column() grupo: number;
  @Column() nombre_grupo: string;
  @Column() autoevaluacion_id: number;

  @Column('float') promedio_enfoque: number;
  @Column('float') promedio_implementacion: number;
  @Column('float') promedio_resultados: number;
  @Column('float') porcentaje_total: number;

  @CreateDateColumn() created_at: Date;
}
