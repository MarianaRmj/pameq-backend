import {
  IsInt,
  IsOptional,
  IsString,
  IsISO8601,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  nombre_actividad!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsISO8601()
  fecha_inicio!: string; // ISO string

  @IsISO8601()
  fecha_fin!: string; // ISO string

  @IsOptional()
  @IsString()
  lugar?: string;

  @IsOptional()
  @IsIn(['programada', 'en_proceso', 'finalizada', 'cancelada'])
  estado?: 'programada' | 'en_proceso' | 'finalizada' | 'cancelada';

  @IsInt()
  institutionId!: number;

  @IsOptional()
  @IsInt()
  sedeId?: number;

  @IsOptional()
  @IsInt()
  cicloId?: number;

  @IsInt()
  responsableId!: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  procesosIds?: number[];
}
