import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

@Entity()
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre_ips: string;

  @Column()
  nit: string;

  @Column()
  correo_contacto: string;

  @Column()
  direccion_principal: string;

  @Column()
  telefono: string;

  @Column()
  codigo_habilitacion: string;

  @Column()
  tipo_institucion: string;

  @Column()
  nombre_representante: string;

  @Column()
  nivel_complejidad: string;

  @Column()
  enfoque: string;

  @OneToMany(() => Sede, (sede) => sede.institution)
  sedes: Sede[];

  @OneToMany(() => Ciclo, (ciclo) => ciclo.institution, {
    cascade: true,
  })
  ciclos: Ciclo[]; // ✅ Aquí defines el tipo correcto
}
