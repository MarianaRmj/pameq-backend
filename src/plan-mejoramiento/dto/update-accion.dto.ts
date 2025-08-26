// src/plan-mejoramiento/dto/update-accion.dto.ts

import {
  IsDateString,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { EstadoAccion } from '../entities/plan-mejoramiento-accion.entity';

export class UpdateAccionDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  responsable_id?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsIn(['Pendiente', 'En ejecución', 'Finalizado'])
  estado?: EstadoAccion;

  @IsOptional()
  @IsNumber()
  avance?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
