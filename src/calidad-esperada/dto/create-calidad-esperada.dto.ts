import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCalidadEsperadaDto {
  @IsInt()
  priorizacion_id: number;

  @IsString()
  @IsNotEmpty()
  calidad_esperada: string;
}
