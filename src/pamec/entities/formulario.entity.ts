// src/pamec/entities/formulario.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EtapaRutaCritica } from './etapa.entity';
import { CampoFormulario } from './campo.entity';

@Entity({ name: 'formularios_etapa' })
export class FormularioEtapa {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => EtapaRutaCritica, (e) => e.formularios)
  etapa: EtapaRutaCritica;
  @Column({ name: 'etapa_id', type: 'int' }) etapaId: number;

  @Column() nombre: string;
  @Column({ type: 'text', nullable: true }) descripcion?: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) version?: string;
  @Column({ type: 'boolean', default: false }) obligatorio: boolean;
  @Column({ type: 'boolean', default: true }) activo: boolean;

  @OneToMany(() => CampoFormulario, (c) => c.formulario)
  campos: CampoFormulario[];
}
