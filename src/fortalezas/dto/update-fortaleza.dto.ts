// src/fortalezas/dto/update-fortaleza.dto.ts
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateFortalezaDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  procesosIds?: number[];
}
