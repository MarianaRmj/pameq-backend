import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOportunidadDto {
  @IsNumber()
  evaluacionId: number;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsNumber()
  procesoId?: number;
}
