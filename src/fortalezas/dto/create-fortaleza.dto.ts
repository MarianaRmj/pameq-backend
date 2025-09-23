// src/fortalezas/dto/create-fortaleza.dto.ts
import { IsInt, IsNotEmpty, IsArray } from 'class-validator';

export class CreateFortalezaDto {
  @IsInt()
  evaluacionId: number;

  @IsInt()
  estandarId: number;

  @IsNotEmpty()
  descripcion: string;

  @IsArray()
  procesosIds: number[];
}
