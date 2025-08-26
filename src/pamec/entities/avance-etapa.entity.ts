// src/pamec/entities/avance-etapa.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EtapaRutaCritica } from './etapa.entity';

@Entity({ name: 'avance_etapas' })
export class AvanceEtapa {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'ciclo_id', type: 'int' }) cicloId: number;
  @ManyToOne(() => EtapaRutaCritica, (e) => e.avances) etapa: EtapaRutaCritica;
  @Column({ name: 'etapa_id', type: 'int' }) etapaId: number;

  @Column({ type: 'date', nullable: true }) fecha_inicio?: string;
  @Column({ type: 'date', nullable: true }) fecha_fin?: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) estado?: string;
  @Column({ name: 'responsable_id', type: 'int', nullable: true })
  responsableId?: number;
  @Column({ type: 'text', nullable: true }) observaciones?: string;
  @Column({ name: 'evidencia_url', type: 'varchar', nullable: true })
  evidenciaUrl?: string;
}
