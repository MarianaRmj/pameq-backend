// src/evaluacion/dto/create-evaluacion-cualitativa.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEvaluacionCualitativaDto {
  @IsInt() autoevaluacionId: number;
  @IsOptional() @IsString() fortalezas?: string;
  @IsOptional() @IsString() soportes_fortalezas?: string;
  @IsOptional() @IsString() oportunidades_mejora?: string;
  @IsOptional() @IsString() efecto_oportunidades?: string;
  @IsOptional() @IsString() acciones_mejora?: string;
  @IsOptional() @IsString() limitantes_acciones?: string;
}
