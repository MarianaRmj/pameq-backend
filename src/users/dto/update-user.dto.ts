import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Permite actualizar sede, pero sigue siendo obligatoria en el modelo.
  @IsOptional()
  @IsNumber()
  sedeId?: number;

  // Nota: institutionId NO se permite por DTO; lo controla el servidor.
}
