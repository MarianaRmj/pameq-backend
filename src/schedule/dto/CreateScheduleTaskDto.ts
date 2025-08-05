import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateScheduleTaskDto {
  @IsString()
  nombre_tarea: string;

  @IsDateString()
  fecha_comienzo: string;

  @IsDateString()
  fecha_fin: string;

  @IsOptional()
  @IsInt()
  duracion?: number; // en días

  @IsOptional()
  @IsEnum(['pendiente', 'en_curso', 'finalizado'])
  estado?: 'pendiente' | 'en_curso' | 'finalizado';

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsNumber()
  progreso?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString() // <--- debe ser string, no array
  predecesoras?: string;

  @IsInt()
  cicloId: number;

  @IsOptional()
  @IsInt()
  sedeId?: number;

  @IsOptional()
  @IsInt()
  institucionId?: number;
}
