import { PartialType } from '@nestjs/mapped-types';
import { CreateOportunidadDto } from './create-oportunidad-mejora.dto';

export class UpdateOportunidadMejoraDto extends PartialType(
  CreateOportunidadDto,
) {}
