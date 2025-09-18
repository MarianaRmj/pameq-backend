import { IsNumber, IsString } from 'class-validator';

export class UpdateCalificacionDto {
  @IsNumber()
  autoevaluacionId: number;

  @IsNumber()
  estandarId: number;

  @IsString()
  nombre: string; // Ej: "SISTEMATICIDAD Y AMPLITUD"

  @IsNumber()
  valor: number; // de 1 a 5
}
