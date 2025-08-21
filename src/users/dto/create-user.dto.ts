import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsNumber()
  sedeId: number;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
