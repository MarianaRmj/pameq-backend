// src/processes/dto/create-process.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IndicadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class CreateProcessDto {
  @IsString()
  nombre_proceso: string;

  @IsString()
  descripcion: string;

  @IsString()
  lider: string;

  @IsNumber()
  numero_integrantes: number;

  @IsNumber()
  institutionId: number;

  @ValidateNested({ each: true })
  @Type(() => IndicadorDto)
  indicadores: IndicadorDto[];
}
