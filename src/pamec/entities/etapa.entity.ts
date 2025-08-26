// src/pamec/entities/etapa.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FormularioEtapa } from './formulario.entity';
import { AvanceEtapa } from './avance-etapa.entity';

@Entity({ name: 'etapas_ruta_critica' })
export class EtapaRutaCritica {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;
  @Column({ type: 'int' }) orden: number;
  @Column({ type: 'text', nullable: true }) descripcion?: string;

  @OneToMany(() => FormularioEtapa, (f) => f.etapa)
  formularios: FormularioEtapa[];
  @OneToMany(() => AvanceEtapa, (a) => a.etapa) avances: AvanceEtapa[];
}
