import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { CicloEstado } from '../enums/ciclo-estado.enum';

export class CreateCicloDto {
  @IsDateString()
  fecha_inicio: string;

  @IsDateString()
  fecha_fin: string;

  @IsString()
  enfoque: string;

  @IsInt()
  sedeId: number;

  @IsEnum(CicloEstado)
  estado: CicloEstado;

  @IsOptional()
  @IsString()
  observaciones: string;

  @IsString()
  institutionId: number;
}
