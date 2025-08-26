// src/pamec/dto/create-respuesta.dto.ts
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ValorCampoDto {
  @IsInt() campoId: number;
  @IsString() valor: string;
}

export class AnexoFormularioDto {
  @IsString() nombreArchivo: string;
  @IsString() tipo: string;
  @IsString() urlArchivo: string;
  @IsOptional() @IsString() descripcion?: string;
}

export class CreateRespuestaFormularioDto {
  @IsInt() cicloId: number;
  @IsInt() sedeId: number;
  @IsInt() usuarioId: number;
  @IsString() estado: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValorCampoDto)
  valores: ValorCampoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnexoFormularioDto)
  anexos?: AnexoFormularioDto[];
}

export class UpdateRespuestaFormularioDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValorCampoDto)
  valores?: ValorCampoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnexoFormularioDto)
  anexosAgregar?: AnexoFormularioDto[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  anexosEliminarIds?: number[];
}
