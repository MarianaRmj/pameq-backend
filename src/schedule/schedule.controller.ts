import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScheduleTaskService } from './schedule.service';
import { CreateScheduleTaskDto } from './dto/CreateScheduleTaskDto';
import { UpdateScheduleTaskDto } from './dto/UpdateScheduleTaskDto';

@Controller('schedule-tasks')
export class ScheduleTaskController {
  constructor(private readonly scheduleTaskService: ScheduleTaskService) {}

  @Post()
  create(@Body() createDto: CreateScheduleTaskDto) {
    return this.scheduleTaskService.create(createDto);
  }

  @Get()
  findAll(
    @Query('cicloId') cicloId?: number,
    @Query('sedeId') sedeId?: number,
    @Query('institucionId') institucionId?: number,
    @Query('responsableId') responsableId?: number,
  ) {
    return this.scheduleTaskService.findAll({
      cicloId,
      sedeId,
      institucionId,
      responsableId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleTaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateScheduleTaskDto) {
    return this.scheduleTaskService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleTaskService.remove(+id);
  }
}
