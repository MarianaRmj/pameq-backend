// dto/create-evaluacion-cualitativa.dto.ts
import { IsOptional, IsArray, IsString } from 'class-validator';

export class CreateEvaluacionCualitativaDto {
  autoevaluacionId: number;

  @IsOptional() @IsArray() fortalezas?: string[];
  @IsOptional() @IsArray() oportunidades_mejora?: string[];

  @IsOptional() @IsString() soportes_fortalezas?: string[];
  @IsOptional() @IsString() efecto_oportunidades?: string[];
  @IsOptional() @IsString() acciones_mejora?: string[];
  @IsOptional() @IsString() limitantes_acciones?: string[];
}
