import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEvaluacionCualitativaDto {
  @IsInt()
  autoevaluacionId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  fortalezas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  oportunidades_mejora?: string[];

  @IsOptional()
  @IsString()
  soportes_fortalezas?: string;

  @IsOptional()
  @IsString()
  efecto_oportunidades?: string;

  @IsOptional()
  @IsString()
  acciones_mejora?: string;

  @IsOptional()
  @IsString()
  limitantes_acciones?: string;
}
