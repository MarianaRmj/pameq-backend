// src/evaluacion/dto/create-detalle-priorizacion.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class CreateDetallePriorizacionDto {
  @IsOptional()
  @IsString()
  fortalezas?: string;

  @IsOptional()
  @IsString()
  oportunidades_mejora?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
