import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { CreateCicloDto } from 'src/cycles/dto/create-cycle.dto';
import { Ciclo } from 'src/cycles/entities/cycle.entity';

export class CreateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  nombre_ips: string;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsString()
  @IsNotEmpty()
  direccion_principal: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  codigo_habilitacion: string;

  @IsString()
  @IsNotEmpty()
  tipo_institucion: string; // pública, privada, mixta

  @IsString()
  @IsNotEmpty()
  nombre_representante: string;

  @IsString()
  @IsNotEmpty()
  nivel_complejidad: string; // baja, media, alta

  @IsString()
  @IsNotEmpty()
  enfoque: string;

  @IsEmail()
  @IsOptional()
  correo_contacto?: string;

  @IsString()
  @IsOptional()
  sitio_web?: string;

  @IsString()
  @IsOptional()
  resolucion_habilitacion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCicloDto)
  ciclos?: Ciclo[]; // ✅ Asegúrate de que tenga tipo definido
}
