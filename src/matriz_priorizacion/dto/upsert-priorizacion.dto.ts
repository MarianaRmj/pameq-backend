// src/priorizacion/dto/upsert-priorizacion.dto.ts
import { IsInt, IsIn } from 'class-validator';

export class UpsertPriorizacionDto {
  @IsInt() procesoId: number;
  @IsInt() estandarId: number;

  @IsIn([1, 3, 5]) riesgo: 1 | 3 | 5;
  @IsIn([1, 3, 5]) costo: 1 | 3 | 5;
  @IsIn([1, 3, 5]) frecuencia: 1 | 3 | 5;
}
