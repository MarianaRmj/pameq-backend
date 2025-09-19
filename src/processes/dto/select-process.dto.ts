import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SelectProcessDto {
  @IsNumber()
  procesoId: number;

  @IsOptional()
  @IsNumber()
  estandarId?: number;

  @IsNumber()
  usuarioId: number;

  @IsBoolean()
  seleccion: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
