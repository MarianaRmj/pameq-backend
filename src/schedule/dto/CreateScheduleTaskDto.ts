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
  duracion?: number;

  @IsOptional()
  @IsEnum(['pendiente', 'en proceso', 'finalizado'])
  estado?: 'pendiente' | 'en proceso' | 'finalizado';

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
}
