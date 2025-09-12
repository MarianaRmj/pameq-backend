import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SelectProcessDto {
  @IsNumber()
  cicloId: number;

  @IsNumber()
  procesoId: number; // ahora es el ID real del Proceso en tu módulo

  @IsOptional()
  @IsNumber()
  estandarId?: number; // opcional si la selección llega a nivel de estándar

  @IsNumber()
  usuarioId: number;

  @IsBoolean()
  seleccion: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
