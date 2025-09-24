// // src/plan-mejoramiento/entities/plan-mejoramiento-accion.entity.ts

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
//   JoinColumn,
// } from 'typeorm';
// import { PriorizacionEstandar } from 'src/priorizacion/entities/priorizacion.entity';
// import { User } from 'src/users/entities/user.entity';

// export type EstadoAccion = 'Pendiente' | 'En ejecución' | 'Finalizado';

// @Entity('plan_mejoramiento_acciones')
// export class PlanMejoramientoAccion {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => PriorizacionEstandar, { eager: true })
//   @JoinColumn({ name: 'priorizacion_id' })
//   priorizacion: PriorizacionEstandar;

//   @Column()
//   priorizacion_id: number;

//   @Column()
//   nombre: string;

//   @Column({ type: 'text', nullable: true })
//   descripcion?: string;

//   @ManyToOne(() => User, { nullable: true, eager: true })
//   @JoinColumn({ name: 'responsable_id' })
//   responsable?: User;

//   @Column({ nullable: true })
//   responsable_id?: number;

//   @Column({ type: 'date' })
//   fecha_inicio: Date;

//   @Column({ type: 'date' })
//   fecha_fin: Date;

//   @Column({
//     type: 'enum',
//     enum: ['Pendiente', 'En ejecución', 'Finalizado'],
//     default: 'Pendiente',
//   })
//   estado: EstadoAccion;

//   @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
//   avance: number;

//   @Column({ type: 'text', nullable: true })
//   observaciones?: string;

//   @Column({ nullable: true })
//   creado_por_id?: number;

//   @CreateDateColumn()
//   fecha_creacion: Date;
// }
