// src/pamec/entities/campo.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FormularioEtapa } from './formulario.entity';

@Entity({ name: 'campos_formulario' })
export class CampoFormulario {
  @PrimaryGeneratedColumn() id: number;
  @ManyToOne(() => FormularioEtapa, (f) => f.campos)
  formulario: FormularioEtapa;
  @Column({ name: 'formulario_id', type: 'int' }) formularioId: number;

  @Column() nombre: string;
  @Column({ type: 'varchar', length: 30 }) tipo: string; // 'text','textarea','select',...
  @Column({ type: 'boolean', default: false }) requerido: boolean;
  @Column({ type: 'int', default: 0 }) orden: number;
  @Column({ type: 'text', nullable: true }) ayuda?: string;
  @Column({ type: 'text', nullable: true }) opciones?: string; // JSON o CSV según tu diseño
}
