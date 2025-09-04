import { PartialType } from '@nestjs/mapped-types';
import { CreateEvidenciaFortalezaDto } from './create-evidencia-fortaleza.dto';

export class UpdateEvidenciaFortalezaDto extends PartialType(CreateEvidenciaFortalezaDto) {}
