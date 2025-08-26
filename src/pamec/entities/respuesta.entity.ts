// src/pamec/entities/respuesta.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('respuestas_formulario')
export class RespuestaFormulario {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'formulario_id' }) formularioId: number;
  @Column({ name: 'ciclo_id' }) cicloId: number;
  @Column({ name: 'sede_id' }) sedeId: number;
  @Column({ name: 'usuario_id' }) usuarioId: number;
  @CreateDateColumn({ name: 'fecha_respuesta' }) fechaRespuesta: Date;
  @Column() estado: string;
}

@Entity('valores_respuesta')
export class ValorRespuesta {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'respuesta_id' }) respuestaId: number;
  @Column({ name: 'campo_id' }) campoId: number;
  @Column('text') valor: string;
}

@Entity('anexos_formulario')
export class AnexoFormulario {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'respuesta_id' }) respuestaId: number;
  @Column() nombreArchivo: string;
  @Column() tipo: string;
  @Column() urlArchivo: string;
  @Column({ nullable: true }) descripcion: string;
}
