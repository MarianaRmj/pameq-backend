import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateScheduleTaskDto {
  @IsString()
  nombre_tarea: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  duracion?: number; // en días

  @IsDateString()
  fecha_comienzo: string;

  @IsDateString()
  fecha_fin: string;

  @IsOptional()
  @IsEnum(['tarea', 'hito', 'resumen'])
  tipo?: 'tarea' | 'hito' | 'resumen';

  @IsOptional()
  @IsNumber()
  progreso?: number;

  @IsOptional()
  @IsString()
  modo?: string;

  @IsOptional()
  @IsEnum(['pendiente', 'en_curso', 'finalizado'])
  estado?: 'pendiente' | 'en_curso' | 'finalizado';

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsArray()
  predecesoras?: string[];

  @IsInt()
  cicloId: number;

  @IsOptional()
  @IsInt()
  sedeId?: number;

  @IsOptional()
  @IsInt()
  institucionId?: number;

  @IsOptional()
  @IsInt()
  responsableId?: number;
}
