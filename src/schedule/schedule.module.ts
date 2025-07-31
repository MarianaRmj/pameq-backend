import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTask } from './entities/schedule-task.entity';
import { ScheduleTaskService } from './schedule.service';
import { ScheduleTaskController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleTask])],
  controllers: [ScheduleTaskController],
  providers: [ScheduleTaskService],
  exports: [ScheduleTaskService],
})
export class ScheduleModule {}
