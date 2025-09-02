import { PartialType } from '@nestjs/mapped-types';
import { CreateCalidadEsperadaDto } from './create-calidad-esperada.dto';

export class UpdateCalidadEsperadaDto extends PartialType(
  CreateCalidadEsperadaDto,
) {}
