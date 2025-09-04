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
import { SeedModule } from './seeds/seed.module';
import { CyclesModule } from './cycles/cycles.module';
import { EventsModule } from './event/event.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ActivitiesModule } from './activity/activity.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GoogleModule } from './google/google.module';
import { ProcessesModule } from './processes/processes.module';
import { PamecModule } from './pamec/pamec.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { AutoevaluacionModule } from './autoevaluacion/autoevaluacion.module';
import { HojaRadarModule } from './hoja-radar/hoja-radar.module';
import { PriorizacionModule } from './priorizacion/priorizacion.module';
import { PlanMejoramientoModule } from './plan-mejoramiento/plan-mejoramiento.module';
import { DetallePriorizacionModule } from './detalle-priorizacion/detalle-priorizacion.module';
import { CalidadEsperadaModule } from './calidad-esperada/calidad-esperada.module';
import { EvidenciaFortalezaModule } from './evidencia-fortaleza/evidencia-fortaleza.module';
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
    GoogleModule,
    ProcessesModule,
    PamecModule,
    EvaluacionModule,
    AutoevaluacionModule,
    HojaRadarModule,
    PriorizacionModule,
    PlanMejoramientoModule,
    DetallePriorizacionModule,
    CalidadEsperadaModule,
    EvidenciaFortalezaModule,
  ],
})
export class AppModule {}
