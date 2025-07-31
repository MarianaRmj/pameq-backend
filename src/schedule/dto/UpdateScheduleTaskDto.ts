import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleTaskDto } from './CreateScheduleTaskDto';

export class UpdateScheduleTaskDto extends PartialType(CreateScheduleTaskDto) {}
