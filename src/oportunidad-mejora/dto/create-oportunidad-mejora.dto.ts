// src/oportunidades/dto/create-oportunidad-mejora.dto.ts
import { IsInt, IsNotEmpty, IsArray } from 'class-validator';

export class CreateOportunidadDto {
  @IsInt()
  evaluacionId: number;

  @IsInt()
  estandarId: number;

  @IsNotEmpty()
  descripcion: string;

  @IsArray()
  procesosIds: number[];
}
