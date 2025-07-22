import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

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

  @IsEmail()
  @IsOptional()
  correo_contacto?: string;

  @IsString()
  @IsOptional()
  sitio_web?: string;

  @IsString()
  @IsOptional()
  resolucion_habilitacion?: string;
}
