// src/processes/dto/select-process.dto.ts
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SelectProcessDto {
  @Type(() => Number)
  @IsInt()
  procesoId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estandarId?: number;

  @Type(() => Number)
  @IsInt()
  usuarioId: number;

  @Type(() => Boolean)
  @IsBoolean()
  seleccionado: boolean; // ⬅️ igual que la entidad

  @IsOptional()
  @IsString()
  observaciones?: string;
}
