import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activity.controller';
import { ActivitiesService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { Evidence } from './entities/evidence.entity';
import { EventsModule } from 'src/event/event.module';
import { Institution } from 'src/institutions/entities/institution.entity';
import { Sede } from 'src/sedes/entities/sede.entity';
import { Ciclo } from 'src/cycles/entities/cycle.entity';
import { User } from 'src/users/entities/user.entity';
import { GoogleDriveService } from 'src/storage/google-drive.service';
import { GoogleModule } from 'src/google/google.module';
import { Proceso } from 'src/processes/entities/process.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Activity,
      Evidence,
      Institution,
      Sede,
      Ciclo,
      User,
      Proceso,
    ]),
    EventsModule,
    GoogleModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, GoogleDriveService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
