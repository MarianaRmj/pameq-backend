import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateOportunidadDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  procesosIds?: number[];
}
