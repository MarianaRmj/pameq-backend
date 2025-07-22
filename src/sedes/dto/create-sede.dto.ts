import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSedeDto {
  @IsString()
  @IsNotEmpty()
  nombre_sede: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  nombre_lider: string;

  @IsString()
  @IsNotEmpty()
  codigo_habilitacion: string;

  @IsNotEmpty()
  institutionId: number;
}
