// src/autoevaluacion/dto/create-autoevaluacion.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateAutoevaluacionDto {
  @IsInt() sede_id: number;
  @IsInt() usuario_id: number;
  @IsString() ciclo: string;
}
