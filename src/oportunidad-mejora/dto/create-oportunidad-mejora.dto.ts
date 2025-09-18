import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreateOportunidadDto {
  @IsNumber()
  evaluacionId: number;

  @IsString()
  descripcion: string;

  @IsArray()
  procesosIds: number[];
}
