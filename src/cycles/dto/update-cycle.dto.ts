import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { CicloEstado } from '../enums/ciclo-estado.enum';

export class UpdateCicloDto {
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsString()
  enfoque?: string;

  @IsOptional()
  @IsEnum(CicloEstado)
  estado?: CicloEstado;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  sedeId?: number;
}
