import { PartialType } from '@nestjs/mapped-types';
import { CreatePamecDto } from './create-pamec.dto';

export class UpdatePamecDto extends PartialType(CreatePamecDto) {}
