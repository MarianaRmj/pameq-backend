import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoevaluacionDto } from './create-autoevaluacion.dto';

export class UpdateAutoevaluacionDto extends PartialType(
  CreateAutoevaluacionDto,
) {}
