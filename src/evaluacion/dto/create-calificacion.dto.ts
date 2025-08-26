import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCalificacionDto {
  @IsInt() autoevaluacionId: number;
  @IsInt() sistematicidad: number;
  @IsInt() proactividad: number;
  @IsInt() ciclo_evaluacion: number;
  @IsInt() total_enfoque: number;
  @IsInt() despliegue_institucion: number;
  @IsInt() despliegue_cliente: number;
  @IsInt() total_implementacion: number;
  @IsInt() pertinencia: number;
  @IsInt() consistencia: number;
  @IsInt() avance_medicion: number;
  @IsInt() tendencia: number;
  @IsInt() comparacion: number;
  @IsInt() total_resultados: number;
  @IsInt() total_estandar: number;
  @IsOptional() @IsString() observaciones?: string;
}
