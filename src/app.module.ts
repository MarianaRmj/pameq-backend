import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './users/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfigFactory } from './config/mailer';
import { RecoverModule } from './auth/recoverPassword/recover.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { SedesModule } from './sedes/sedes.module';
import { SeedModule } from './seeders/seed.module';
import { CyclesModule } from './cycles/cycles.module';
import { EventsModule } from './event/event.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ActivitiesModule } from './activity/activity.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm')!,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60m' },
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mailerConfigFactory,
    }),
    AuthModule,
    UserModule,
    RecoverModule,
    DashboardModule,
    InstitutionsModule,
    SedesModule,
    SeedModule,
    CyclesModule,
    EventsModule,
    ScheduleModule,
    ActivitiesModule,
  ],
})
export class AppModule {}
