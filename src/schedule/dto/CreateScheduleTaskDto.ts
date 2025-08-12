import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsIn,
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
  duracion?: number;

  @IsOptional()
  @IsIn(['pendiente', 'en_curso', 'finalizado'])
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

  // string plano (ej: "1,3FS,7")
  @IsOptional()
  @IsString()
  predecesoras?: string;

  @IsInt()
  cicloId: number;

  @IsOptional()
  @IsInt()
  sedeId?: number;

  @IsOptional()
  @IsInt()
  institucionId?: number;

  // ⬇️ NUEVO
  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsIn(['baja', 'media', 'alta'])
  prioridad?: 'baja' | 'media' | 'alta';
}
